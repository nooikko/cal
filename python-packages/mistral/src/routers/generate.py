from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

# IMPORTANT: import generate_response from model.py
from ..model import generate_response

router = APIRouter()

class ConversationItem(BaseModel):
    message: str

class ChatPayload(BaseModel):
    systemPrompt: str
    conversation: List[ConversationItem]

@router.post("/chat")
def chat_endpoint(payload: ChatPayload):
    """
    Receives systemPrompt + conversation, returns a Mistral-based response.
    """
    system_prompt = payload.systemPrompt
    conversation_items = payload.conversation

    # 1. Build the text prompt for Mistral
    prompt = system_prompt.strip() + "\n"

    for item in conversation_items:
        prompt += f"User: {item.message}\n"

    # Mistral's turn
    prompt += "Mistral: "

    # 2. Call the Mistral model
    # Instead of returning a dummy response, we now call generate_response
    answer = generate_response(prompt)

    # 3. Return the model output as JSON
    return {"reply": answer}
