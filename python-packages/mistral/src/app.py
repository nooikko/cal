from fastapi import FastAPI
from .routers import health, generate

app = FastAPI(title="Mistral API")

# Include sub-routers
app.include_router(health.router, prefix="/health", tags=["Health Check"])
app.include_router(generate.router, prefix="/chat", tags=["Generate"])

@app.get("/")
def root():
    return {"status": "ok", "message": "Mistral API is running"}
