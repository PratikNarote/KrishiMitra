from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("MONGO_URI")
print("URI:", uri)

client = MongoClient(uri)

try:
    client.admin.command("ping")
    print("✅ Connected Successfully")
except Exception as e:
    print("❌ Error:")
    print(e)