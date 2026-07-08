import time
import os
import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from google.genai import types
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logging import logger
from app.api.routes import submissions
from app.api.routes import analysis as analysis_routes
from app.api.routes import intelligence as intelligence_routes
from app.api.routes import dashboard as dashboard_routes


from app.utils.request_id import generate_request_id

app = FastAPI(
    title="People's Priorities AI API",
    description="API for the Multilingual AI Decision Intelligence Platform",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase SDK
firebase_initialized = False
firebase_error = None
db = None

try:
    # Initialize using stringified JSON credentials if provided (secure production environment config)
    if settings.FIREBASE_SERVICE_ACCOUNT_JSON:
        logger.info("Initializing Firebase Admin with credentials from FIREBASE_SERVICE_ACCOUNT_JSON env var")
        import json
        service_account_info = json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON)
        cred = credentials.Certificate(service_account_info)
        firebase_admin.initialize_app(cred)
    # Otherwise if credentials path is provided and exists, use it.
    elif settings.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
        logger.info(f"Initializing Firebase Admin with credentials from {settings.GOOGLE_APPLICATION_CREDENTIALS}")
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app(cred)
    else:
        logger.info("Initializing Firebase Admin with default application credentials")
        # Initialize app with default options or mock values if running locally without credentials
        if settings.ENVIRONMENT == "development" and not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
            # Set a dummy project ID if not set
            os.environ.setdefault("GOOGLE_CLOUD_PROJECT", settings.FIREBASE_PROJECT_ID)
            # Use credentials.Anonymous() to allow offline / local mock operations if credentials aren't present
            try:
                firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
            except ValueError:
                # App already exists
                pass
        else:
            firebase_admin.initialize_app()
    
    db = firestore.client()
    firebase_initialized = True
    logger.info("Firebase SDK initialized successfully.")
except Exception as e:
    firebase_error = str(e)
    logger.error(f"Firebase SDK initialization failed: {firebase_error}")

# Initialize Gemini SDK
gemini_initialized = False
gemini_error = None

try:
    if settings.GEMINI_API_KEY:
        # Verify the key works by creating a client (new google-genai SDK)
        _gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        gemini_initialized = True
        logger.info(f"Gemini SDK (google-genai) configured successfully with model: {settings.GEMINI_MODEL}")
    else:
        # Fallback for development if key is missing
        if settings.ENVIRONMENT == "development":
            logger.warning("GEMINI_API_KEY is not set. Gemini features will run in mock/fallback mode.")
            gemini_initialized = True
        else:
            raise ValueError("GEMINI_API_KEY is required in production environment.")
except Exception as e:
    gemini_error = str(e)
    logger.error(f"Gemini SDK initialization failed: {gemini_error}")


# Request ID and process timing middleware
@app.middleware("http")
async def request_lifecycle_middleware(request: Request, call_next):
    # 1. Request ID Generation (Generated before entering router/service layers)
    request_id = generate_request_id()
    request.state.request_id = request_id
    
    start_time = time.time()
    
    # 2. Proceed with request
    response = await call_next(request)
    
    # 3. Add response headers and log process times
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Request-ID"] = request_id
    
    # Exclude health check from verbose middleware logging
    if request.url.path != "/health":
        logger.info(f"[{request_id}] [API Lifecycle] finished in {process_time:.4f}s")
        
    return response


# Override validation error responses to match BAD-01 specifications
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    request_id = getattr(request.state, "request_id", None)
    if not request_id:
        request_id = generate_request_id()
        request.state.request_id = request_id

    # Format errors details list
    details = []
    for error in exc.errors():
        details.append({
            "loc": error.get("loc"),
            "msg": error.get("msg"),
            "type": error.get("type")
        })

    logger.warning(
        f"[{request_id}] [Validation Warning] Request validation failed - "
        f"Path: {request.url.path}, Details: {details}"
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "requestId": request_id,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed.",
                "details": details
            }
        }
    )


# Health Check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint as defined in SDD_00.md API Contract.
    """
    return {
        "status": "healthy",
        "service": "people-priorities-ai",
        "version": "1.0.0"
    }


# Include Routers
app.include_router(submissions.router, prefix="/api/v1")
app.include_router(analysis_routes.router, prefix="/api/v1")
app.include_router(intelligence_routes.router, prefix="/api/v1")
app.include_router(dashboard_routes.router, prefix="/api/v1")


