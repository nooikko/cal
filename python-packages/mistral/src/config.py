MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2"

SYSTEM_PROMPT = (
    "Respond to the user's questions directly and succinctly, without mentioning what you are or "
    "caveating your capabilities.\n"
    "If the user refers to something previously discussed, answer clearly without restating large parts "
    "of earlier responses.\n"
    "Do not mention that you are an assistant or explain your inability to do something. "
    "Just answer the question.\n"
)

CONVERSATION_WINDOW = 10
