from fastapi import Header, HTTPException
import os

async def api_key_auth(x_api_key: str = Header(None)):
    API_ADMIN_KEY = os.getenv("API_ADMIN_KEY")
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key missing")
    if x_api_key != API_ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return True