import os
import requests

async def convert_text_to_speech(text, target_language_code, model="bulbul:v2"):
    API_SECRET = os.getenv("API_KEY")
    if not API_SECRET:
        raise Exception("API_SECRET is not configured")
    url = "https://api.sarvam.ai/text-to-speech"
    payload = {
        "text": text,
        "target_language_code": target_language_code,
        "model": model,
    }
    headers = {
        "api-subscription-key": API_SECRET,
        "Content-Type": "application/json",
    }
    response = requests.post(url, json=payload, headers=headers)
    if not response.ok:
        raise Exception(f"Text-to-speech failed: {response.text}")
    return response.json()