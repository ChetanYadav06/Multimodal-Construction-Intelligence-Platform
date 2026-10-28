import os
import json
import uuid
import shutil
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.config import UPLOAD_DIR
from backend.database import init_db
from backend.ai_service import process_ai_request
from backend.routes.safety import router as safety_router
from backend.routes.cracks import router as cracks_router
from backend.routes.valuation import router as valuation_router
from backend.routes.planning import router as planning_router
from backend.routes.daily_site import router as daily_site_router
from backend.routes.knowledge import router as knowledge_router
from backend.routes.history import router as history_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables on startup
    init_db()
    yield

app = FastAPI(
    title="Multimodal Construction Intelligence Platform API",
    description="Intelligent AI-driven civil engineering, site safety, structural crack analysis, project planning, valuation, and site operations platform.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded media files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include Routers
app.include_router(safety_router)
app.include_router(cracks_router)
app.include_router(valuation_router)
app.include_router(planning_router)
app.include_router(daily_site_router)
app.include_router(knowledge_router)
app.include_router(history_router)

# =====================================================================
# CENTRALIZED AI PROCESSING ENDPOINT (Activity 4.1, 4.2 & 4.3)
# =====================================================================
@app.post("/api/ai/process", tags=["Centralized AI Handler"])
async def centralized_ai_process(
    feature: str = Form(...),
    payload: Optional[str] = Form("{}"),
    image: Optional[UploadFile] = File(None)
):
    """
    Centralized Multimodal AI request handler for all platform modules.
    Accepts feature identifier, payload data, and optional construction image.
    """
    try:
        parsed_payload = json.loads(payload) if payload else {}
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed JSON in payload form field.")

    saved_path = None
    if image and image.filename:
        ext = Path(image.filename).suffix.lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            raise HTTPException(status_code=400, detail="Invalid image format. Supported: JPG, PNG, WEBP.")
        
        filename = f"{uuid.uuid4().hex[:10]}{ext}"
        saved_path = UPLOAD_DIR / filename
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    try:
        result = process_ai_request(feature=feature, payload=parsed_payload, image_path=saved_path)
        return {
            "status": "success",
            "feature": feature,
            "result": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Centralized AI processing error: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "Multimodal Construction Intelligence Platform API is running.",
        "docs_url": "/docs",
        "health_check": "/api/status"
    }

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "construction-intelligence-backend"}
