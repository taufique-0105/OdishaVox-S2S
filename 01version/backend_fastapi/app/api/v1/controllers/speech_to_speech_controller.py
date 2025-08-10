from fastapi import UploadFile, File, HTTPException
from app.api.v1.utils.convert_speech_to_text import convert_speech_to_text
from app.api.v1.utils.convert_text_to_speech import convert_text_to_speech
from app.api.v1.utils.translate_text import translate_text

async def get_speech_to_speech():
    return {
        "message": "This is the Speech to Speech API endpoint. Please use POST method with audio data.",
        "status": "success",
    }

async def post_speech_to_speech(audio: UploadFile = File(...)):
    try:
        # Step 1: Speech to Text
        speech_result = await convert_speech_to_text(audio)
        target_language = "od-IN" if speech_result.get("language_code") == "en-IN" else "en-IN"

        # Step 2: Text Translation
        translation_result = await translate_text(speech_result["transcript"], target_language)

        # Step 3: Text to Speech
        tts_result = await convert_text_to_speech(
            translation_result["translation"],
            target_language_code=target_language
        )

        return {
            "message": "Speech to Speech conversion successful",
            "originalAudio": audio.filename,
            "transcript": speech_result["transcript"],
            "translation": translation_result["translation"],
            "audio": tts_result["audios"][0] if tts_result.get("audios") else None,
            "pipeline": {
                "sourceLanguage": translation_result.get("sourceLanguage"),
                "targetLanguage": translation_result.get("targetLanguage"),
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))