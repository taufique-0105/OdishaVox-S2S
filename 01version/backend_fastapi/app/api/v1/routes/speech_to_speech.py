from fastapi import APIRouter
from app.api.v1.controllers import speech_to_speech_controller

router = APIRouter()

router.get("/")(speech_to_speech_controller.get_speech_to_speech)
router.post("/")(speech_to_speech_controller.post_speech_to_speech)