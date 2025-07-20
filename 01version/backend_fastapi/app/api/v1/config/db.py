import motor.motor_asyncio
import os
from urllib.parse import urlparse
import logging
import sys

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/test")

parsed = urlparse(MONGODB_URI)
if parsed.path and parsed.path != "/":
    db_name = parsed.path.lstrip("/")
else:
    db_name = "test"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client[db_name]

async def check_db_connection():
    try:
        await client.admin.command('ping')
        logging.info(f"MongoDB connected: {MONGODB_URI}")
    except Exception as e:
        logging.error(f"Database connection failed: {e}")
        sys.exit(1)  # Exit the process if DB connection fails