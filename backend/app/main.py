import time
import os
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger

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
    # If credentials path is provided and exists, use it.
    if settings.GOOGLE_APPLICATION_CREDENTIALS and os.path.exists(settings.GOOGLE_APPLICATION_CREDENTIALS):
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
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Verify model initialization (gemini-2.5-flash as per SDD_00/AI architecture)
        model = genai.GenerativeModel('gemini-2.5-flash')
        gemini_initialized = True
        logger.info("Gemini SDK configured successfully.")
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


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(f"Request {request.method} {request.url.path} finished in {process_time:.4f}s")
    return response


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
