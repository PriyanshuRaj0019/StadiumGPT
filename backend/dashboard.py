import json
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from config import settings

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "crowd_data.json")

# 1. FIXED: Robust API Key fetch and Model name
api_key = getattr(settings, "GEMINI_API_KEY", None) or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash", # FIXED: Changed 2.5 to 1.5
    google_api_key=api_key,
    temperature=0.2 
)

def get_dashboard_data():
    """Reads live telemetry data and generates an AI summary."""
    try:
        # FIXED: Moved file reading INSIDE the try block
        if not os.path.exists(DATA_PATH):
            raise FileNotFoundError(f"Data file missing at {DATA_PATH}")
            
        with open(DATA_PATH, "r") as f:
            data = json.load(f)
        
        prompt = f"""
        You are the Chief Operations AI for the FIFA 2026 World Cup stadium.
        Analyze the following live telemetry data and provide a 2-sentence operational summary.
        Highlight any severe bottlenecks or safety concerns, and recommend a quick action for the ground staff.
        
        Data:
        Total Attendance: {data['total_attendance']} / {data['max_capacity']}
        Gates: {data['gates']}
        Food Courts: {data['food_courts']}
        """
        
        ai_insight = llm.invoke(prompt).content
        
    except Exception as e:
        print(f"🔥 Gemini API/File Error in Dashboard: {e}")
        ai_insight = "System currently unable to generate AI insights. Please monitor charts manually."
        data = {} # Failsafe empty data so frontend doesn't crash completely

    return {
        "telemetry": data,
        "ai_insight": ai_insight
    }
