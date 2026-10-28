import uuid
from datetime import datetime
from fastapi import APIRouter
from backend.schemas import (
    DailySiteAssistantRequest, 
    DailySiteAssistantResponse,
    WeatherAdvisorRequest,
    WeatherAdvisorResponse,
    DailySiteRequest, 
    DailySiteResponse
)
from backend.ai_service import process_ai_request, analyze_daily_site_weather
from backend.database import save_record

router = APIRouter(tags=["Daily Site & Weather Operations"])

# -------------------------------------------------------------
# Activity 5.2: Daily Site Assistant
# -------------------------------------------------------------
@router.post("/api/daily-assistant/analyze", response_model=DailySiteAssistantResponse)
async def daily_site_assistant_endpoint(payload: DailySiteAssistantRequest):
    record_id = f"DSA-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()

    result_data = process_ai_request("daily_site_assistant", payload.model_dump())

    response = DailySiteAssistantResponse(
        id=record_id,
        timestamp=timestamp,
        planned_activity=result_data["planned_activity"],
        labour_count=result_data["labour_count"],
        site_conditions=result_data["site_conditions"],
        daily_task_breakdown=result_data["daily_task_breakdown"],
        required_materials_equipment=result_data["required_materials_equipment"],
        safety_precautions_checks=result_data["safety_precautions_checks"],
        potential_risk_alerts=result_data["potential_risk_alerts"],
        summary_directive=result_data["summary_directive"]
    )

    summary_fields = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "location_name": payload.location_name or "Active Site",
        "weather_condition": payload.planned_activity[:50],
        "site_safety_index": 90
    }
    save_record("daily_site_reports", record_id, summary_fields, response.model_dump())

    return response


# -------------------------------------------------------------
# Activity 5.3: Weather-Aware Construction Advisory
# -------------------------------------------------------------
@router.post("/api/weather-advisor/advisory", response_model=WeatherAdvisorResponse)
async def weather_advisor_endpoint(payload: WeatherAdvisorRequest):
    record_id = f"WTR-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.now().isoformat()

    result_data = process_ai_request("weather_advisor", payload.model_dump())

    response = WeatherAdvisorResponse(
        id=record_id,
        timestamp=timestamp,
        location_name=result_data["location_name"],
        temperature_c=result_data["temperature_c"],
        humidity_pct=result_data["humidity_pct"],
        rain_probability_pct=result_data["rain_probability_pct"],
        wind_speed_kmh=result_data["wind_speed_kmh"],
        weather_condition=result_data["weather_condition"],
        site_readiness_score=result_data["site_readiness_score"],
        overall_recommendation=result_data["overall_recommendation"],
        activity_decisions=result_data["activity_decisions"],
        hazard_precautions=result_data["hazard_precautions"],
        mitigation_recommendations=result_data["mitigation_recommendations"],
        data_source_note=result_data["data_source_note"]
    )

    summary_fields = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "location_name": response.location_name,
        "weather_condition": response.weather_condition,
        "site_safety_index": response.site_readiness_score
    }
    save_record("daily_site_reports", record_id, summary_fields, response.model_dump())

    return response


# Legacy endpoint for backward compatibility
@router.post("/api/daily-site/advisory", response_model=DailySiteResponse)
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
