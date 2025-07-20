from fastapi import APIRouter
from app.api.v1.controllers import feedback_controller

router = APIRouter()

router.post("/submit")(feedback_controller.submit_feedback)
router.get("/")(feedback_controller.get_feedback)