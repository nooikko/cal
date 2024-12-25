import ffmpeg
import numpy as np

def decode_audio_to_np(audio_data: bytes, sample_rate: int = 16000) -> np.ndarray:
    """
    Uses ffmpeg to decode raw bytes (webm, mp3, wav, etc.) into a float32 NumPy array.
    Output is single-channel (ac=1), resampled to `sample_rate`.
    """
    try:
        out, _ = (
            ffmpeg
            .input('pipe:0')
            .output('pipe:1', format='f32le', ac=1, ar=sample_rate)
            .run(input=audio_data, capture_stdout=True, capture_stderr=True)
        )
        audio_np = np.frombuffer(out, np.float32).flatten()
        return audio_np
    except ffmpeg.Error as e:
        raise RuntimeError(f"FFmpeg error: {e.stderr.decode()}")
