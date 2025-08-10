from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Feedback(BaseModel):
    name: Optional[str] = "Anonymous"
    email: Optional[str] = "No email provided"
    rating: int = Field(..., ge=1, le=5)
    message: str
    createdAt: Optional[datetime] = None