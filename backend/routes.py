from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import traceback # Error detail nikalne ke liye
from chatbot import get_ai_response
from navigation import get_smart_route, load_map_data
from dashboard import get_dashboard_data
from volunteer import get_sop_guidance
from accessibility import get_accessibility_advice

router = APIRouter()

# --- Models ---
class ChatRequest(BaseModel): 
    message: str
    language: str = "English"

class ChatResponse(BaseModel): 
    reply: str

class NavRequest(BaseModel): 
    start: str
    destination: str

class IncidentRequest(BaseModel):
    incident_type: str
    location: str
    details: str = ""

class AccessibilityRequest(BaseModel):
    query: str

# --- Endpoints ---
@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        reply = get_ai_response(request.message, request.language)
        return ChatResponse(reply=reply)
    except Exception as e:
        # ASLI ERROR PRINT KAREGA RENDER LOGS MEIN
        print(f"🔥 CHAT CRASH REPORT: {str(e)}")
        print(traceback.format_exc())
        
        # FRONTEND PAR BHI ASLI ERROR BHEJEGA
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

@router.get("/locations")
async def locations_endpoint():
    return {"locations": list(load_map_data().keys())}

@router.post("/navigate")
async def navigate_endpoint(request: NavRequest):
    return get_smart_route(request.start, request.destination)

@router.get("/dashboard")
async def dashboard_endpoint():
    return get_dashboard_data()

@router.post("/volunteer/sop")
async def volunteer_sop_endpoint(request: IncidentRequest):
    return get_sop_guidance(request.incident_type, request.location, request.details)

@router.post("/accessibility/assist")
async def accessibility_endpoint(request: AccessibilityRequest):
    return get_accessibility_advice(request.query)
