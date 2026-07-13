import numpy as np
import tensorflow as tf

from tensorflow.keras.preprocessing import image

from utils.class_names import CLASS_NAMES

# ===========================
# Load Trained Model
# ===========================

model = tf.keras.models.load_model(
    "models/best_model.keras"
)

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

img_array = np.expand_dims(
    img_array,
    axis=0
)

img_array = img_array / 255.0

# ===========================
# Prediction
# ===========================

prediction = model.predict(img_array)

predicted_index = np.argmax(prediction)

confidence = np.max(prediction)

print("\nPrediction Result")
print("---------------------------")
print("Disease :", CLASS_NAMES[predicted_index])
print(f"Confidence : {confidence*100:.2f}%")