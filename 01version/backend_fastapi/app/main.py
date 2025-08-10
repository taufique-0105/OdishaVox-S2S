from dotenv import load_dotenv
load_dotenv()

import logging
from fastapi import FastAPI
from app.api.v1.routes import (
    text_to_speech,
    speech_to_text,
    speech_to_speech,
    text_to_text,
    feedback,
)
from app.api.v1.config.db import check_db_connection

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await check_db_connection()
    logging.info("Server is running...")  # Optional, Uvicorn logs the URL by default

@app.get("/")
def root():
    return "Hello, this is the API for OdiaAudioGen!"

app.include_router(text_to_speech.router, prefix="/api/v1/tts")
app.include_router(speech_to_text.router, prefix="/api/v1/stt")
app.include_router(speech_to_speech.router, prefix="/api/v1/sts")
app.include_router(text_to_text.router, prefix="/api/v1/ttt")
app.include_router(feedback.router, prefix="/api/v1/feedback")