from fastapi import APIRouter
from ..config import MODEL_NAME
from ..utils import is_model_ready

router = APIRouter()

@router.get("/")
def health_check():
    """
    Simple health check route.
    Could also check if the model is loaded, memory usage, etc.
    """
    status = "ready" if is_model_ready() else "loading"
    return {
        "model_name": MODEL_NAME,
        "status": status
    }
