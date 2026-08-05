from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path
import os

load_dotenv(Path(__file__).parent / ".env")

print("Mongo URI:", os.getenv("MONGO_URI"))

client = MongoClient(os.getenv("MONGO_URI"))

# Force MongoDB connection
client.admin.command("ping")
print("✅ MongoDB Ping Successful!")

db = client["krishimitra"]
predictions = db["predictions"]

print("✅ MongoDB Connected Successfully!")