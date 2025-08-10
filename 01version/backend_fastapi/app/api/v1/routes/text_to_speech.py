from fastapi import APIRouter
from app.api.v1.controllers import text_to_speech_controller

router = APIRouter()

router.get("/")(text_to_speech_controller.get_text_to_speech)
router.post("/")(text_to_speech_controller.post_text_to_speech)