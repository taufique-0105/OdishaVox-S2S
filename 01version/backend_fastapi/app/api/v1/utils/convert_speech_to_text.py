import os
import requests

async def convert_speech_to_text(audio):
    API_SECRET = os.getenv("API_KEY")
    if not API_SECRET:
        raise Exception("API_SECRET is not configured")
    url = "https://api.sarvam.ai/speech-to-text"
    files = {
        "file": (audio.filename, await audio.read(), audio.content_type),
    }
    data = {
        "model": "saarika:v2",
        "language_code": "unknown",
    }
    headers = {
        "api-subscription-key": API_SECRET,
    }
    response = requests.post(url, files=files, data=data, headers=headers)
    if not response.ok:
        raise Exception(f"Speech-to-text failed: {response.text}")
    return response.json()