import uuid
import shutil
from datetime import datetime
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from backend.config import UPLOAD_DIR
from backend.schemas import CrackAnalysisResponse
from backend.ai_service import analyze_crack
from backend.database import save_record

router = APIRouter(prefix="/api/cracks", tags=["Structural Crack Analysis"])

@router.post("/analyze", response_model=CrackAnalysisResponse)
async def analyze_crack_endpoint(
    image: Optional[UploadFile] = File(None),
    structural_element: Optional[str] = Form("Beam"),
    material: Optional[str] = Form("Reinforced Concrete"),
    notes: Optional[str] = Form("")
):
    record_id = f"CRK-{uuid.uuid4().hex[:8].upper()}"
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

    result_data = analyze_crack(
        image_path=saved_path,
        structural_element=structural_element or "Beam",
        material=material or "Reinforced Concrete",
        notes=notes or ""
    )

    response = CrackAnalysisResponse(
        id=record_id,
        timestamp=timestamp,
        image_url=image_url,
        crack_type=result_data.get("crack_type", "Structural Crack"),
        severity=result_data.get("severity", "Medium"),
        risk_score=result_data.get("risk_score", 65),
        structural_element=result_data.get("structural_element", f"{material} {structural_element}"),
        estimated_width_mm=result_data.get("estimated_width_mm", "1.5 - 3.0 mm"),
        crack_orientation=result_data.get("crack_orientation", "Diagonal"),
        is_structural_hazard=result_data.get("is_structural_hazard", True),
        probable_causes=result_data.get("probable_causes", []),
        structural_implication=result_data.get("structural_implication", ""),
        remediation_plan=result_data.get("remediation_plan", []),
        monitoring_recommendation=result_data.get("monitoring_recommendation", "")
    )

    summary_fields = {
        "timestamp": timestamp,
        "image_url": image_url or "",
        "crack_type": response.crack_type,
        "severity": response.severity,
        "risk_score": response.risk_score,
        "structural_element": response.structural_element
    }
    save_record("crack_analyses", record_id, summary_fields, response.model_dump())

    return response

