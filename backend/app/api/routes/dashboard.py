"""
routes/dashboard.py — REST API endpoints for the Decision Intelligence Portal.
"""
from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse


from app.services.dashboard_service import DashboardService
from app.api.dependencies.dashboard import get_dashboard_service
from app.utils.request_id import generate_request_id
from app.core.logging import logger

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    status_code=status.HTTP_200_OK,
    summary="Get high-level summary counts",
)
async def get_summary(
    request: Request,
    service: DashboardService = Depends(get_dashboard_service),
):
    request_id = getattr(request.state, "request_id", generate_request_id())
    logger.info(f"[{request_id}] [DashboardAPI] GET /dashboard/summary")
    try:
        data = await service.get_summary()
        return {"success": True, "requestId": request_id, "data": data}
    except Exception as exc:
        logger.error(f"[{request_id}] [DashboardAPI] summary failed: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "requestId": request_id, "error": {"message": str(exc)}},
        )


@router.get(
    "/priorities",
    status_code=status.HTTP_200_OK,
    summary="Get priority queue list",
)
async def get_priorities(
    request: Request,
    service: DashboardService = Depends(get_dashboard_service),
):
    request_id = getattr(request.state, "request_id", generate_request_id())
    logger.info(f"[{request_id}] [DashboardAPI] GET /dashboard/priorities")
    try:
        data = await service.get_priorities()
        return {"success": True, "requestId": request_id, "data": data}
    except Exception as exc:
        logger.error(f"[{request_id}] [DashboardAPI] priorities failed: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "requestId": request_id, "error": {"message": str(exc)}},
        )


@router.get(
    "/hotspots",
    status_code=status.HTTP_200_OK,
    summary="Get geographic hotspots list",
)
async def get_hotspots(
    request: Request,
    service: DashboardService = Depends(get_dashboard_service),
):
    request_id = getattr(request.state, "request_id", generate_request_id())
    logger.info(f"[{request_id}] [DashboardAPI] GET /dashboard/hotspots")
    try:
        data = await service.get_hotspots()
        return {"success": True, "requestId": request_id, "data": data}
    except Exception as exc:
        logger.error(f"[{request_id}] [DashboardAPI] hotspots failed: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "requestId": request_id, "error": {"message": str(exc)}},
        )


@router.get(
    "/recommendations",
    status_code=status.HTTP_200_OK,
    summary="Get active recommendation directives list",
)
async def get_recommendations(
    request: Request,
    service: DashboardService = Depends(get_dashboard_service),
):
    request_id = getattr(request.state, "request_id", generate_request_id())
    logger.info(f"[{request_id}] [DashboardAPI] GET /dashboard/recommendations")
    try:
        data = await service.get_recommendations()
        return {"success": True, "requestId": request_id, "data": data}
    except Exception as exc:
        logger.error(f"[{request_id}] [DashboardAPI] recommendations failed: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "requestId": request_id, "error": {"message": str(exc)}},
        )


@router.get(
    "/review",
    status_code=status.HTTP_200_OK,
    summary="Get human review queue",
)
async def get_review_queue(
    request: Request,
    service: DashboardService = Depends(get_dashboard_service),
):
    request_id = getattr(request.state, "request_id", generate_request_id())
    logger.info(f"[{request_id}] [DashboardAPI] GET /dashboard/review")
    try:
        data = await service.get_review_queue()
        return {"success": True, "requestId": request_id, "data": data}
    except Exception as exc:
        logger.error(f"[{request_id}] [DashboardAPI] review queue failed: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "requestId": request_id, "error": {"message": str(exc)}},
        )


@router.get(
    "/submissions/{submission_id}",
    status_code=status.HTTP_200_OK,
    summary="Get full submission lineage details for explorer",
)
async def get_submission_explorer(
    submission_id: str,
    request: Request,
    service: DashboardService = Depends(get_dashboard_service),
):
    request_id = getattr(request.state, "request_id", generate_request_id())
    logger.info(f"[{request_id}] [DashboardAPI] GET /dashboard/submissions/{submission_id}")
    try:
        data = await service.get_submission_explorer(submission_id)
        return {"success": True, "requestId": request_id, "data": data}
    except ValueError as val_err:
        logger.warning(f"[{request_id}] [DashboardAPI] explorer not found: {val_err}")
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "requestId": request_id, "error": {"message": str(val_err)}},
        )
    except Exception as exc:
        logger.error(f"[{request_id}] [DashboardAPI] explorer failed: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "requestId": request_id, "error": {"message": str(exc)}},
        )
