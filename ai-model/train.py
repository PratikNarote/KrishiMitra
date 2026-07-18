import os

# Hide unnecessary TensorFlow logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
import matplotlib.pyplot as plt

from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    GlobalAveragePooling2D,
    Dense,
    Dropout
)

from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau
)
# ===========================
# Dataset Configuration
# ===========================

DATASET_PATH = "../dataset/PlantVillage"

IMG_SIZE = (224, 224)

BATCH_SIZE = 32

EPOCHS = 15

# ===========================
# Data Augmentation
# ===========================

train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,

    validation_split=0.2,

    rotation_range=20,

    zoom_range=0.2,

    horizontal_flip=True
)
# ===========================
# Training Dataset
# ===========================

train_generator = train_datagen.flow_from_directory(
    DATASET_PATH,

    target_size=IMG_SIZE,

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    subset="training"
)
# ===========================
# Validation Dataset
# ===========================

validation_generator = train_datagen.flow_from_directory(
    DATASET_PATH,

    target_size=IMG_SIZE,

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    subset="validation"
)
# ===========================
# Dataset Information
# ===========================

print("\nClasses:")

print(train_generator.class_indices)

print("\nTraining Images:",
      train_generator.samples)

print("Validation Images:",
      validation_generator.samples)

# ===========================
# Load MobileNetV2
# ===========================

base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze pretrained layers
base_model.trainable = False

# ===========================
# Custom Classification Head
# ===========================

x = base_model.output

x = GlobalAveragePooling2D()(x)

x = Dropout(0.3)(x)

x = Dense(
    128,
    activation="relu"
)(x)

x = Dropout(0.2)(x)

predictions = Dense(
    train_generator.num_classes,
    activation="softmax"
)(x)

model = Model(
    inputs=base_model.input,
    outputs=predictions
)
# ===========================
# Compile Model
# ===========================

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)
print("\nModel Summary\n")

model.summary()
# ===========================
# Create Models Folder
# ===========================

os.makedirs("models", exist_ok=True)

# ===========================
# Callbacks
# ===========================

early_stopping = EarlyStopping(
    monitor="val_loss",
    patience=3,
    restore_best_weights=True,
    verbose=1
)

checkpoint = ModelCheckpoint(
    filepath="models/best_model.keras",
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)

reduce_lr = ReduceLROnPlateau(
    monitor="val_loss",
    factor=0.2,
    patience=2,
    min_lr=1e-6,
    verbose=1
)


print("\nStarting Initial Training...\n")

history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=EPOCHS,
    callbacks=[
        early_stopping,
        checkpoint,
        reduce_lr
    ]
)
# ===========================
# Save Final Model
# ===========================

model.save("models/final_model.keras")

print("\n====================================")
print("✅ Training Completed Successfully!")
print("✅ Best Model Saved : models/best_model.keras")
print("✅ Final Model Saved: models/final_model.keras")
print("====================================")