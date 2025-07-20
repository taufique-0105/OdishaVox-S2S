import os
import requests

async def translate_text(text, target_language):
    API_SECRET = os.getenv("API_KEY")
    if not API_SECRET:
        raise Exception("API_SECRET is not configured")
    url = "https://api.sarvam.ai/translate"
    payload = {
        "input": text,
        "source_language_code": "auto",
        "target_language_code": target_language,
    }
    headers = {
        "api-subscription-key": API_SECRET,
        "Content-Type": "application/json",
    }
    response = requests.post(url, json=payload, headers=headers)
    if not response.ok:
        raise Exception(f"Translation failed: {response.text}")
    result = response.json()
    if "translated_text" not in result:
        raise Exception("Invalid translation response - missing translated_text")
    return {
        "success": True,
        "originalText": text,
        "translation": result["translated_text"],
        "sourceLanguage": result.get("source_language_code", "auto"),
        "targetLanguage": result.get("target_language_code", target_language),
    }