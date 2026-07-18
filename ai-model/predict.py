import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing import image

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
# ===========================
# Load Trained Model
# ===========================

model = tf.keras.models.load_model("models/best_model.keras")

print("✅ Model Loaded Successfully!")
# ===========================
# Image Path
# ===========================

IMAGE_PATH = "test.jpg"

# ===========================
# Load Image
# ===========================

img = image.load_img(
    IMAGE_PATH,
    target_size=(224, 224)
)

img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = img_array / 255.0

# ===========================
# Prediction
# ===========================
prediction = model.predict(img_array)[0]

top3 = np.argsort(prediction)[-3:][::-1]

print("\nPrediction Results")
print("---------------------------")

for i, idx in enumerate(top3, 1):
    print(f"{i}. {CLASS_NAMES[idx]} : {prediction[idx] * 100:.2f}%")
