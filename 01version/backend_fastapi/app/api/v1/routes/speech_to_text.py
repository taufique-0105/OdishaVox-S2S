from fastapi import APIRouter
from app.api.v1.controllers import speech_to_text_controller

router = APIRouter()

router.get("/")(speech_to_text_controller.get_speech_to_text)
router.post("/")(speech_to_text_controller.post_speech_to_text)