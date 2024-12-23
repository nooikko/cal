from fastapi import APIRouter
from ..config import model_is_loaded

router = APIRouter()

@router.get("/")
def health_check():
    """
    Simple health check endpoint.
    You could expand this to return CPU usage, memory usage, etc.
    """
    status = "loaded" if model_is_loaded else "not_loaded"
    return {"status": "OK", "whisper_status": status}
