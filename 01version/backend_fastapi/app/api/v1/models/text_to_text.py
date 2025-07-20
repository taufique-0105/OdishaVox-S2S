from pydantic import BaseModel

class TextToTextRequest(BaseModel):
    text: str
    targetLanguage: str = "en-IN"