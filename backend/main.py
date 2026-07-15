from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "StadiumGPT Backend Running"
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