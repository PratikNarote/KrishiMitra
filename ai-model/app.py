from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from PIL import Image
from chatbot import ask_gemini
from pydantic import BaseModel
from database import predictions
from datetime import datetime
from bson import ObjectId
import io
CLASS_NAMES = [
    "Pepper Bell - Bacterial Spot",
    "Pepper Bell - Healthy",
    "Potato - Early Blight",
    "Potato - Late Blight",
    "Potato - Healthy",
    "Tomato - Bacterial Spot",
    "Tomato - Early Blight",
    "Tomato - Late Blight",
    "Tomato - Leaf Mold",
    "Tomato - Septoria Leaf Spot",
    "Tomato - Spider Mites",
    "Tomato - Target Spot",
    "Tomato - Yellow Leaf Curl Virus",
    "Tomato - Mosaic Virus",
    "Tomato - Healthy"
]

model = tf.keras.models.load_model("models/best_model.keras")

print("✅ AI Model Loaded Successfully!")



app = FastAPI(
    title="KrishiMitra AI API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str
    disease: str
    weather: dict
    location: str
    advisory: list

@app.get("/")
def home():
    return {
        "message": "Welcome to KrishiMitra AI API",
        "status": "Running"
    }

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Read uploaded image
    contents = await file.read()

    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize((224, 224))

    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    # Predict
    prediction = model.predict(img_array)[0]

    # Top prediction
    predicted_index = np.argmax(prediction)
    confidence = float(prediction[predicted_index] * 100)
    disease = CLASS_NAMES[predicted_index]

    # Top 3 predictions
    top3_indices = np.argsort(prediction)[-3:][::-1]

    top3_predictions = []

    for i in top3_indices:
        top3_predictions.append({
            "disease": CLASS_NAMES[i],
            "confidence": round(float(prediction[i] * 100), 2)
        })

    # Save prediction to MongoDB
    try:
        result = predictions.insert_one({
            "disease": disease,
            "confidence": round(confidence, 2),
            "timestamp": datetime.now()
        })

        print("✅ Saved to MongoDB")
        print("Inserted ID:", result.inserted_id)

    except Exception as e:
        print("❌ MongoDB Insert Error:")
        print(type(e))
        print(e)

    return {
        "disease": disease,
        "confidence": round(confidence, 2),
        "top3": top3_predictions
    }



@app.get("/history")
def get_history():
    try:
        data = []

        for item in predictions.find().sort("timestamp", -1):
            data.append({
                "_id": str(item["_id"]),
                "disease": item["disease"],
                "confidence": item["confidence"],
                "timestamp": item["timestamp"]
            })

        return {
            "success": True,
            "count": len(data),
            "predictions": data
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.delete("/history")
def delete_history():
    try:
        result = predictions.delete_many({})

        return {
            "success": True,
            "message": f"{result.deleted_count} records deleted."
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

@app.delete("/history/{id}")
def delete_prediction(id: str):
    result = predictions.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 1:
        return {
            "success": True,
            "message": "Prediction deleted successfully."
        }

    return {
        "success": False,
        "message": "Prediction not found."
    }

@app.post("/chat")
def chat(request: ChatRequest):

    answer = ask_gemini(
        request.question,
        request.disease,
        request.weather,
        request.location,
        request.advisory
    )

    return {
        "answer": answer
    }