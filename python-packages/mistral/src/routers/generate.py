import logging
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from ..model import generate_response

router = APIRouter()
logger = logging.getLogger(__name__)

class ConversationItem(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatPayload(BaseModel):
    systemPrompt: str
    conversation: List[ConversationItem]
    personality_id: Optional[str] = None

@router.post("")
def chat_endpoint(payload: ChatPayload):
    """
    Receives systemPrompt + conversation, returns a Mistral-based (or other LLM-based) response.

    NOTE:
    - No database writes happen here. The Next.js service handles creating ChatLog entries.
    - This endpoint simply constructs a prompt from the input and gets a response from the LLM.
    """
    logger.info("Received chat request")
    system_prompt = payload.systemPrompt
    conversation_items = payload.conversation

    # Build the text prompt for Mistral (or your chosen LLM)
    prompt = system_prompt.strip() + "\n"
    for item in conversation_items:
        prompt += f"User: {item.message}\n"

    # Mistral's turn:
    prompt += "Mistral: "

    # Generate model response
    answer = generate_response(prompt)

    # Return the model output as JSON
    logger.info("Returning response")
    return {"reply": answer}
