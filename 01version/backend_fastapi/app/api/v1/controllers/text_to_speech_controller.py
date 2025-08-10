from fastapi import HTTPException
from app.api.v1.models.text_to_speech import TextToSpeechRequest
from app.api.v1.utils.convert_text_to_speech import convert_text_to_speech

async def get_text_to_speech():
    return {
        "message": "This is the NEW text-to-speech endpoint",
        "data": {
            "text": "Hello, this is a sample text for TTS.",
            "target_language_code": "en-US",
        },
    }

async def post_text_to_speech(body: TextToSpeechRequest):
    text = body.text
    target_language_code = body.target_language_code
    try:
        result = await convert_text_to_speech(text, target_language_code)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))