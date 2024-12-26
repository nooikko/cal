# main.py
import logging

if __name__ == "__main__":
    # Configure logging for INFO level
    logging.basicConfig(level=logging.INFO)

    import uvicorn
    uvicorn.run("src.app:app", host="localhost", port=8001, reload=False)
