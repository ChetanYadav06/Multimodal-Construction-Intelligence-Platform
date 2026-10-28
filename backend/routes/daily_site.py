import uuid
from datetime import datetime
from fastapi import APIRouter
from backend.schemas import DailySiteRequest, DailySiteResponse
from backend.ai_service import analyze_daily_site_weather
from backend.database import save_record

router = APIRouter(prefix="/api/daily-site", tags=["Daily Site Assistance & Weather Advisory"])

@router.post("/advisory", response_model=DailySiteResponse)
async def daily_site_advisory_endpoint(payload: DailySiteRequest):
    record_id = f"DSR-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()

    result_data = analyze_daily_site_weather(
        date=payload.date,
        location_name=payload.location_name,
        temp_c=payload.temperature_c,
        humidity_pct=payload.humidity_pct,
        rain_prob_pct=payload.rain_probability_pct,
        wind_kmh=payload.wind_speed_kmh,
        activities=payload.scheduled_activities,
        total_workers=payload.total_workers_on_site
    )

    response = DailySiteResponse(
        id=record_id,
        timestamp=timestamp,
        date=payload.date,
        location_name=payload.location_name,
        weather_condition=result_data["weather_condition"],
        temperature_c=payload.temperature_c,
        humidity_pct=payload.humidity_pct,
        rain_probability_pct=payload.rain_probability_pct,
        wind_speed_kmh=payload.wind_speed_kmh,
        site_safety_index=result_data["site_safety_index"],
        overall_weather_alert=result_data["overall_weather_alert"],
        activity_risk_matrix=result_data["activity_risk_matrix"],
        daily_site_report_text=result_data["daily_site_report_text"],
        recommended_toolbox_talk=result_data["recommended_toolbox_talk"]
    )

    summary_fields = {
        "date": payload.date,
        "location_name": payload.location_name,
        "weather_condition": response.weather_condition,
        "site_safety_index": response.site_safety_index
    }
    save_record("daily_site_reports", record_id, summary_fields, response.model_dump())

    return response

