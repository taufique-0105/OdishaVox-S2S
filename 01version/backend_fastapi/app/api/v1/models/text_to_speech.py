from pydantic import BaseModel

class TextToSpeechRequest(BaseModel):
    text: str
    target_language_code: str