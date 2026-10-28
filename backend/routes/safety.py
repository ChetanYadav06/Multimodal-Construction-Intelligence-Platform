import uuid
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.config import UPLOAD_DIR
from backend.schemas import SafetyAnalysisResponse
from backend.ai_service import analyze_safety
from backend.database import save_record

router = APIRouter(prefix="/api/safety", tags=["Safety Monitoring"])

@router.post("/analyze", response_model=SafetyAnalysisResponse)
async def analyze_safety_endpoint(
    image: Optional[UploadFile] = File(None),
    notes: Optional[str] = Form(""),
    location_tag: Optional[str] = Form("General Construction Zone")
):
    record_id = f"SAFE-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()
    image_url = None
    saved_path = None

    if image and image.filename:
        ext = Path(image.filename).suffix.lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            raise HTTPException(status_code=400, detail="Invalid image format. Supported: JPG, PNG, WEBP.")
        
        filename = f"{record_id}{ext}"
        saved_path = UPLOAD_DIR / filename
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"/uploads/{filename}"

    # Perform Multimodal AI safety evaluation
    result_data = analyze_safety(image_path=saved_path, notes=notes or "")
    
    response = SafetyAnalysisResponse(
        id=record_id,
        timestamp=timestamp,
        image_url=image_url,
        safety_score=result_data.get("safety_score", 75),
        risk_level=result_data.get("risk_level", "Medium"),
        compliance_status=result_data.get("compliance_status", "Warning"),
        ppe_compliance=result_data.get("ppe_compliance", []),
        hazards_identified=result_data.get("hazards_identified", []),
        overall_summary=result_data.get("overall_summary", ""),
        recommended_actions=result_data.get("recommended_actions", []),
        inspector_notes=notes
    )

    # Persist in Database
    summary_fields = {
        "timestamp": timestamp,
        "image_url": image_url or "",
        "safety_score": response.safety_score,
        "risk_level": response.risk_level,
        "compliance_status": response.compliance_status
    }
    save_record("safety_inspections", record_id, summary_fields, response.model_dump())

    return response

