import uuid
from datetime import datetime
from fastapi import APIRouter
from backend.schemas import PlanningRequest, PlanningResponse
from backend.ai_service import process_ai_request
from backend.database import save_record

router = APIRouter(prefix="/api/planning", tags=["Construction Project Planning"])

@router.post("/generate", response_model=PlanningResponse)
async def generate_planning_endpoint(payload: PlanningRequest):
    record_id = f"PLN-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()

    # Pass through centralized AI dispatcher with feature identifier
    result_data = process_ai_request("project_planning", payload.model_dump())

    response = PlanningResponse(
        id=record_id,
        timestamp=timestamp,
        project_name=result_data["project_name"],
        project_description=result_data["project_description"],
        city_location=result_data["city_location"],
        plot_dimensions=result_data["plot_dimensions"],
        construction_type=result_data["construction_type"],
        total_area_sqft=result_data["total_area_sqft"],
        target_duration_months=result_data["target_duration_months"],
        currency="INR",
        currency_symbol="₹",
        cost_breakdown=result_data["cost_breakdown"],
        core_materials_summary=result_data["core_materials_summary"],
        bill_of_materials=result_data["bill_of_materials"],
        schedule_milestones=result_data["schedule_milestones"],
        trade_manpower=result_data["trade_manpower"],
        architectural_preview=result_data["architectural_preview"],
        executive_summary=result_data["executive_summary"],
        risk_mitigation_notes=result_data["risk_mitigation_notes"]
    )

    summary_fields = {
        "timestamp": timestamp,
        "project_name": response.project_name,
        "building_type": response.construction_type,
        "total_area_sqft": response.total_area_sqft,
        "total_estimated_budget": response.cost_breakdown.total_estimated_budget
    }
    save_record("project_plans", record_id, summary_fields, response.model_dump())

    return response
