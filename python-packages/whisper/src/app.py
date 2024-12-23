from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.health import router as health_router
from .routers.transcribe import router as transcribe_router

app = FastAPI(
    title="Whisper API",
    description="API for transcribing audio with Whisper (CPU-based)",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your domain(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# You can mount these routers on different paths
app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(transcribe_router, prefix="/api", tags=["transcribe"])

@app.get("/")
def root():
    """
    Root endpoint for a quick check or redirect.
    """
    return {"message": "Welcome to the Whisper API."}
