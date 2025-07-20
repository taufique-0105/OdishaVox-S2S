from fastapi import HTTPException, Depends
from app.api.v1.models.feedback import Feedback
from app.api.v1.config.db import db
from app.api.v1.dependencies.auth import api_key_auth

async def submit_feedback(feedback: Feedback):
    if not feedback.rating or not feedback.message:
        raise HTTPException(status_code=400, detail="Rating and message are required")
    feedback_dict = feedback.dict()
    feedback_dict["createdAt"] = feedback_dict.get("createdAt")
    result = await db.feedback.insert_one(feedback_dict)
    feedback_dict["_id"] = str(result.inserted_id)
    return {"success": True, "message": "Feedback submitted successfully", "data": feedback_dict}

async def get_feedback(auth=Depends(api_key_auth)):
    try:
        feedbacks = []
        async for fb in db.feedback.find():
            fb["_id"] = str(fb["_id"])
            feedbacks.append(fb)
        return {"success": True, "data": feedbacks}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")