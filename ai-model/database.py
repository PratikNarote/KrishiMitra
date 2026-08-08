import os
from pathlib import Path

from pymongo import MongoClient
from dotenv import load_dotenv


# ============================================
# PROJECT PATH
# ============================================

BASE_DIR = Path(__file__).resolve().parent

# .env is inside ai-model/
ENV_FILE = BASE_DIR / ".env"

# Load .env
load_dotenv(ENV_FILE)


# ============================================
# MONGODB CONFIGURATION
# ============================================

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError(
        "❌ MONGO_URI is missing. "
        "Please add MONGO_URI to your .env file."
    )

print("Mongo URI:", MONGO_URI)


# ============================================
# MONGODB CONNECTION
# ============================================

try:

    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=20000
    )

    # Test MongoDB connection
    client.admin.command("ping")

    print("✅ MongoDB Ping Successful!")


    # ========================================
    # DATABASE
    # ========================================

    db = client["krishimitra"]

    print("✅ MongoDB Connected Successfully!")


    # ========================================
    # COLLECTIONS
    # ========================================

    # Crop prediction history
    predictions = db["predictions"]

    # Registered users
    users = db["users"]


    # ========================================
    # INDEXES
    # ========================================

    # Prevent duplicate email registration
    users.create_index(
        "email",
        unique=True
    )

    # Faster sorting of prediction history
    predictions.create_index(
        "timestamp"
    )


    print("✅ MongoDB Collections Ready!")
    print("📁 Database:", db.name)
    print("👤 Users Collection:", users.name)
    print("🌾 Predictions Collection:", predictions.name)


except Exception as e:

    print("❌ MongoDB Connection Error:")
    print("Error Type:", type(e).__name__)
    print("Error:", e)

    raise