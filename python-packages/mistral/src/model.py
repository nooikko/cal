import logging
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from .config import MODEL_NAME

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

logger = logging.getLogger(__name__)

logger.info("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)

logger.info("Loading model...")
model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    quantization_config=bnb_config,
    device_map="auto",
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True
)

logger.info("Model loaded.")

def generate_response(prompt: str, max_length=1024, do_sample=False) -> str:
    """
    Generate a response from the Mistral model given a prompt.
    """
    logger.info("Generating response to prompt: %s", prompt)
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    eos_token_id = tokenizer.eos_token_id

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=max_length,
            do_sample=do_sample,
            pad_token_id=eos_token_id
        )

    # Decode
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    parts = response.split("Mistral:")
    if len(parts) > 1:
        return parts[-1].strip()
    else:
        return response.strip()
