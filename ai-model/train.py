import os

# Hide most TensorFlow logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

# ==========================
# Dataset Configuration
# ==========================
DATASET_PATH = "../dataset/PlantVillage"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 5

# ==========================
# Image Preprocessing
# ==========================
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    validation_split=0.2,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

train_generator = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training"
)

validation_generator = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation"
)

# ==========================
# Build MobileNetV2 Model
# ==========================
base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze pretrained layers
base_model.trainable = False

# Custom Classification Head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.3)(x)
x = Dense(128, activation="relu")(x)
x = Dropout(0.2)(x)

predictions = Dense(
    train_generator.num_classes,
    activation="softmax"
)(x)

model = Model(
    inputs=base_model.input,
    outputs=predictions
)

# ==========================
# Compile Model
# ==========================
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# Display model summary
model.summary()

# ==========================
# Create models folder
# ==========================
os.makedirs("models", exist_ok=True)

# ==========================
# Callbacks
# ==========================
early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=3,
    restore_best_weights=True
)

checkpoint = ModelCheckpoint(
    filepath="models/best_model.keras",
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)

# ==========================
# Train Model
# ==========================
history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=EPOCHS,
    callbacks=[early_stopping, checkpoint]
)

# ==========================
# Save Final Model
# ==========================
model.save("models/crop_disease_model.keras")

print("\n====================================")
print("✅ Training Completed Successfully!")
print("✅ Best Model Saved : models/best_model.keras")
print("✅ Final Model Saved: models/crop_disease_model.keras")
print("====================================")