import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def ask_gemini(question, disease, weather, location, advisory):
    prompt = f"""
You are KrishiMitra AI, an agriculture expert.

Detected Disease:
{disease}

Location:
{location}

Weather:
Temperature: {weather['main']['temp']} °C
Humidity: {weather['main']['humidity']} %
Condition: {weather['weather'][0]['main']}

Recommended Advisory:
{advisory}

Farmer Question:
{question}

Give a practical, easy-to-understand answer.
"""

    response = model.generate_content(prompt)

    return response.text