import uuid
from datetime import datetime
from fastapi import APIRouter
from backend.schemas import PlanningRequest, PlanningResponse
from backend.ai_service import generate_project_plan
from backend.database import save_record

router = APIRouter(prefix="/api/planning", tags=["Construction Project Planning"])

@router.post("/generate", response_model=PlanningResponse)
async def generate_planning_endpoint(payload: PlanningRequest):
    record_id = f"PLN-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()

    result_data = generate_project_plan(
        project_name=payload.project_name,
        building_type=payload.building_type,
        total_area_sqft=payload.total_area_sqft,
        target_duration_months=payload.target_duration_months,
        finish_grade=payload.finish_grade,
        labor_rate_tier=payload.labor_rate_tier
    )

    response = PlanningResponse(
        id=record_id,
        timestamp=timestamp,
        project_name=payload.project_name,
        total_area_sqft=payload.total_area_sqft,
        target_duration_months=payload.target_duration_months,
        cost_breakdown=result_data["cost_breakdown"],
        bill_of_materials=result_data["bill_of_materials"],
        schedule_milestones=result_data["schedule_milestones"],
        trade_manpower=result_data["trade_manpower"],
        executive_summary=result_data["executive_summary"],
        risk_mitigation_notes=result_data["risk_mitigation_notes"]
    )

    summary_fields = {
        "timestamp": timestamp,
        "project_name": payload.project_name,
        "building_type": payload.building_type,
        "total_area_sqft": payload.total_area_sqft,
        "total_estimated_budget": response.cost_breakdown.total_estimated_budget
    }
    save_record("project_plans", record_id, summary_fields, response.model_dump())

    return response

