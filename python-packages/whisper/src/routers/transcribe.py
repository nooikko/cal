from fastapi import APIRouter, File, UploadFile
from ..config import model
from ..utils import decode_audio_to_np

router = APIRouter()

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Accepts an audio file in memory, decodes, and transcribes with Whisper.
    Returns {"transcription": "..."} or {"error": "..."}.
    """
    try:
        # Read raw bytes
        audio_data = await file.read()

        # Decode to float32 NumPy array
        audio_array = decode_audio_to_np(audio_data)

        # Transcribe with Whisper (model is from config.py)
        result = model.transcribe(audio_array)
        text = result.get("text", "")

        return {"transcription": text}

    except Exception as e:
        return {"error": str(e)}
