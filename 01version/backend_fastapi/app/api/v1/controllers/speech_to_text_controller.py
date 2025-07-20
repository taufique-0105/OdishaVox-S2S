from fastapi import UploadFile, File, HTTPException
from app.api.v1.utils.convert_speech_to_text import convert_speech_to_text

async def get_speech_to_text():
    return {
        "message": "This is the Speech to Text API endpoint. Please use POST method with audio data.",
        "status": "success",
    }

async def post_speech_to_text(audio: UploadFile = File(...)):
    if not audio:
        raise HTTPException(status_code=400, detail="Missing audio file in request.")
    try:
        result = await convert_speech_to_text(audio)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))