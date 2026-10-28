import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.config import UPLOAD_DIR
from backend.database import init_db
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

