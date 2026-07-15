import json
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from config import settings

SOP_PATH = os.path.join(os.path.dirname(__file__), "data", "emergency_sop.json")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.1 # Very low temperature for strict, reliable emergency protocols
)

def get_sop_guidance(incident_type: str, location: str, extra_details: str = ""):
    with open(SOP_PATH, "r") as f:
        sop_data = json.load(f)
    
    # Check if we have a base protocol, otherwise use a general one
    base_protocol = sop_data.get(incident_type, "Assess the situation calmly and contact the Zone Supervisor.")
    
    prompt = f"""
    You are the AI Safety Commander for the FIFA 2026 World Cup.
    A volunteer has reported an incident.
    
    Incident Type: {incident_type}
    Location: {location}
    Additional Details: {extra_details}
    Base Protocol: {base_protocol}
    
    Generate a strict, step-by-step Standard Operating Procedure (SOP) for the volunteer. 
    Keep it under 4 bullet points. Be direct, authoritative, and prioritize safety.
    """
    
    try:
        response = llm.invoke(prompt).content
        return {"incident": incident_type, "location": location, "ai_sop": response}
    except Exception as e:
        print(f"Volunteer AI Error: {e}")
        return {"incident": incident_type, "ai_sop": "ERROR: Network failure. Follow base protocol: " + base_protocol}