import uuid
from datetime import datetime
from fastapi import APIRouter
from backend.schemas import ValuationRequest, ValuationResponse
from backend.ai_service import process_ai_request
from backend.database import save_record

router = APIRouter(prefix="/api/valuation", tags=["Real Estate Valuation"])

@router.post("/evaluate", response_model=ValuationResponse)
async def evaluate_valuation_endpoint(payload: ValuationRequest):
    record_id = f"VAL-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()

    # Pass through centralized AI dispatcher with feature identifier
    result_data = process_ai_request("real_estate_valuation", payload.model_dump())

    response = ValuationResponse(
        id=record_id,
        timestamp=timestamp,
        property_location=result_data["property_location"],
        property_type=result_data["property_type"],
        built_up_area_sqft=result_data["built_up_area_sqft"],
        estimated_fair_value=result_data["estimated_fair_value"],
        valuation_range_low=result_data["valuation_range_low"],
        valuation_range_high=result_data["valuation_range_high"],
        price_per_sqft=result_data["price_per_sqft"],
        currency="INR",
        currency_symbol="₹",
        comparable_sales=result_data["comparable_sales"],
        appreciation_forecast=result_data["appreciation_forecast"],
        rental_yield_estimate_pct=result_data["rental_yield_estimate_pct"],
        monthly_rental_estimate=result_data["monthly_rental_estimate"],
        investment_score=result_data["investment_score"],
        market_sentiment=result_data["market_sentiment"],
        swot_analysis=result_data["swot_analysis"],
        valuation_summary=result_data["valuation_summary"]
    )

    summary_fields = {
        "timestamp": timestamp,
        "property_type": response.property_type,
        "built_up_area_sqft": response.built_up_area_sqft,
        "estimated_fair_value": response.estimated_fair_value,
        "price_per_sqft": response.price_per_sqft
    }
    save_record("real_estate_valuations", record_id, summary_fields, response.model_dump())

    return response
