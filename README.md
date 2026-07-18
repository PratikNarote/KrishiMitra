# 🌿 KrishiMitra AI

An AI-powered Crop Disease Detection System that helps farmers identify plant diseases from leaf images using Deep Learning.

## 🚀 Features

- 🌱 Crop Disease Detection using TensorFlow
- 🤖 MobileNetV2 Deep Learning Model
- ⚡ FastAPI Backend
- 🎨 React Frontend
- 📷 Image Upload
- 📊 Disease Prediction with Confidence Score
- 💊 Treatment Suggestions
- 🛡️ Prevention Tips

---

## Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- FastAPI
- Python

### AI/ML
- TensorFlow
- Keras
- NumPy
- Pillow

---

## Dataset

PlantVillage Dataset

Classes:
- Pepper
- Potato
- Tomato

Total Classes: **15**

---

## Project Structure

```
KrishiMitra
│
├── ai-model
│   ├── app.py
│   ├── predict.py
│   ├── train.py
│   ├── requirements.txt
│   └── utils
│
├── backend
│
├── frontend
│
├── docs
│
└── README.md
```

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/KrishiMitra.git

cd KrishiMitra

python -m venv .venv

pip install -r ai-model/requirements.txt
```

---

## Run FastAPI

```bash
cd ai-model

uvicorn app:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

---

## Model Performance

| Metric | Value |
|---------|-------|
| Validation Accuracy | 91.68% |
| Classes | 15 |
| Architecture | MobileNetV2 |

---

## Future Improvements

- Weather Forecast
- Fertilizer Recommendation
- Voice Assistant
- Multilingual Support
- Farmer Dashboard

---

## Author

**Pratik Gajanand Narote**

B.Tech Computer Science Engineering (AI)

GH Raisoni College of Engineering & Management, Pune