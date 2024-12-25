import whisper
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"

# Load the model once (e.g. "large", "base", "small", etc.)
# Adjust based on your needs
print("Loading Whisper model on CPU...")
model = whisper.load_model("large", device=device)
print("Whisper model loaded.")

# A simple flag so we can confirm if the model finished loading
model_is_loaded = True
