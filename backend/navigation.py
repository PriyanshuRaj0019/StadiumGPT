import json
import os
import random
from langchain_google_genai import ChatGoogleGenerativeAI
from config import settings

MAP_DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "stadium_map.json")

# Initialize Gemini for dynamic routing text
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=settings.GEMINI_API_KEY,
    temperature=0.7 # Slightly higher for more natural, varied suggestions
)

def load_map_data():
    with open(MAP_DATA_PATH, "r") as f:
        return json.load(f)["locations"]

def get_smart_route(start: str, destination: str):
    locations = load_map_data()
    
    if start not in locations or destination not in locations:
        raise ValueError("Invalid start or destination location.")

    start_coords = locations[start]
    dest_coords = locations[destination]
    
    # Generate mock path points (Start -> Midpoint -> End) to draw a curve on the map
    mid_lat = (start_coords["lat"] + dest_coords["lat"]) / 2 + random.uniform(-0.0005, 0.0005)
    mid_lng = (start_coords["lng"] + dest_coords["lng"]) / 2 + random.uniform(-0.0005, 0.0005)
    
    path = [
        [start_coords["lat"], start_coords["lng"]],
        [mid_lat, mid_lng],
        [dest_coords["lat"], dest_coords["lng"]]
    ]
    
    # Mock estimated time based on fixed distances for hackathon demo purposes
    estimated_time = random.randint(3, 12)
    
    # Use Gemini to generate a "Crowd-Aware" suggestion
    prompt = f"""
    You are the StadiumGPT Navigation AI. 
    A user wants to walk from {start} to {destination}. The estimated time is {estimated_time} minutes.
    Generate a short, 2-sentence friendly navigation instruction. 
    Make up a realistic live crowd scenario (e.g., "The East concourse is currently crowded, so we recommend taking the outer walkway.").
    """
    
    ai_response = llm.invoke(prompt).content
    
    return {
        "start": start,
        "destination": destination,
        "path": path,
        "estimated_time_minutes": estimated_time,
        "ai_suggestion": ai_response
    }