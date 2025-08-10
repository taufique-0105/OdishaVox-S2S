from fastapi import HTTPException
from app.api.v1.models.text_to_text import TextToTextRequest
from app.api.v1.utils.translate_text import translate_text

async def get_text_to_text():
    return {
        "message": "This is the Text to Text API endpoint. Please use POST method with text data.",
        "status": "success",
    }

async def post_text_to_text(body: TextToTextRequest):
    text = body.text
    target_language = body.targetLanguage
    if not text:
        raise HTTPException(status_code=400, detail="Text to translate is required")
    try:
        result = await translate_text(text, target_language)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))