from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

from config import settings
from routes import router
import vector_store

app = FastAPI(
    title="StadiumGPT Backend",
    version="1.0.0",
    description="GenAI-enabled Stadium Assistant"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root path for frontend assets
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

# Mount CSS & JS static structures cleanly
if os.path.exists(FRONTEND_DIR):
    app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
    app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")

@app.on_event("startup")
async def startup():
    print("=" * 50)
    print("StadiumGPT Backend Started")
    print("Environment:", settings.ENV)

    if settings.GEMINI_API_KEY:
        print("GEMINI_API_KEY Loaded")
    else:
        print("GEMINI_API_KEY Missing")

    if vector_store.vector_db is None:
        print("FAISS Database NOT Loaded")
    else:
        print("FAISS Database Loaded")
    print("=" * 50)

# Include core business logic APIs under /api prefix
app.include_router(router, prefix="/api")

# --- HTML View Catchers ---
@app.get("/view/dashboard")
async def serve_dashboard_page():
    return FileResponse(os.path.join(FRONTEND_DIR, "dashboard.html"))

@app.get("/view/chat")
async def serve_chat_page():
    return FileResponse(os.path.join(FRONTEND_DIR, "chat.html"))

@app.get("/")
async def root():
    return {
        "message": "StadiumGPT Backend Running",
        "endpoints": {
            "dashboard_ui": "/view/dashboard",
            "chat_ui": "/view/chat",
            "api_health": "/api/health"
        }
    }

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "environment": settings.ENV
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True
    )