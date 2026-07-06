import logging
import sys
from app.core.config import settings

def setup_logging():
    log_level = logging.getLevelName(settings.LOG_LEVEL.upper())
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    logger = logging.getLogger("people-priorities-ai")
    logger.info(f"Logging initialized with level: {settings.LOG_LEVEL}")
    return logger

logger = setup_logging()
