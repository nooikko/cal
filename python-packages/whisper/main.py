import uvicorn

if __name__ == "__main__":
    # By default, run on localhost:8000
    uvicorn.run("src.app:app", host="0.0.0.0", port=8000, reload=True)
