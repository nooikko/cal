import datetime

def format_conversation(system_prompt, conversation, window=10):
    text = system_prompt.strip() + "\n"
    truncated = conversation[-window * 2:] if window > 0 else conversation

    for role, msg in truncated:
        if role.lower() == "user":
            text += f"User: {msg}\n"
        else:
            text += f"Mistral: {msg}\n"
    text += "Mistral: "
    return text

def log_debug_info(user_input, prompt, raw_output, answer, conversation, debug_file="debug_log.txt"):
    with open(debug_file, "a", encoding="utf-8") as f:
        f.write(f"\n----- DEBUG LOG ENTRY [{datetime.datetime.now()}] -----\n")
        f.write(f"USER INPUT: {user_input}\n\n")
        f.write("FULL CONVERSATION:\n")
        for role, msg in conversation:
            f.write(f"{role}: {msg}\n")
        f.write("\nPROMPT TO MODEL:\n")
        f.write(prompt + "\n")
        f.write("\nMODEL RAW OUTPUT:\n")
        f.write(raw_output + "\n")
        f.write("\nFINAL ANSWER:\n")
        f.write(answer + "\n")
        f.write("----- END DEBUG LOG ENTRY -----\n\n")

def is_model_ready():
    """
    Placeholder for checking if model is fully loaded.
    Could check a global or some other signals if needed.
    """
    # For now, just return True. If you have async loading, integrate that logic here.
    return True
