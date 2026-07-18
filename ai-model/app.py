from fastapi import FastAPI, File, UploadFile
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from PIL import Image
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

app = FastAPI(
    title="KrishiMitra AI API",
    version="1.0"
)

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

    predicted_index = np.argmax(prediction)

    confidence = float(prediction[predicted_index] * 100)

    return {
        "disease": CLASS_NAMES[predicted_index],
        "confidence": round(confidence, 2)
    }