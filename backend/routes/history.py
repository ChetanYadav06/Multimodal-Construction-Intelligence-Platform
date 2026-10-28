from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException
from backend.database import get_records, get_dashboard_stats
from backend.config import GROQ_API_KEY, GEMINI_API_KEY
from backend.ai_service import groq_client, gemini_client

router = APIRouter(prefix="/api", tags=["Platform Dashboard & History"])

@router.get("/status")
async def platform_status():
    return {
        "status": "online",
        "platform": "Multimodal Construction Intelligence Platform",
        "version": "1.0.0",
        "ai_engine": {
            "groq_configured": bool(GROQ_API_KEY),
            "groq_active": groq_client is not None,
            "groq_vision_model": "llama-3.2-11b-vision-preview",
            "groq_text_model": "llama-3.3-70b-versatile",
            "gemini_configured": bool(GEMINI_API_KEY),
            "gemini_active": gemini_client is not None,
            "gemini_model": "gemini-3.8-flash",
            "fallback_heuristic_engine": "Active (High-Accuracy Engineering Heuristics)"
        }
    }

@router.get("/samples")
async def get_demo_samples():
    return {
        "safety": {
            "title": "Tower Scaffolding & Fall Risk Inspection",
            "image_url": "/uploads/sample_safety_site.jpg",
            "notes": "Surveillance of perimeter scaffolding at elevation level 2. Check worker PPE and fall arrest harness tie-offs.",
            "location_tag": "Sector 4B Superstructure"
        },
        "crack": {
            "title": "Reinforced Concrete Beam Diagonal Crack",
            "image_url": "/uploads/sample_structural_crack.jpg",
            "structural_element": "Beam",
            "material": "Reinforced Concrete",
            "notes": "Diagonal 45-degree crack extending 600mm from northern column support. Optical gauge GAUGE-02 installed."
        },
        "valuation": {
            "title": "Parc Residences - Class A Development",
            "image_url": "/uploads/sample_property.jpg",
            "property_type": "Residential Apartment",
            "built_up_area_sqft": 2800,
            "location_tier": "Tier 1 Suburban",
            "quality_grade": "Premium",
            "age_years": 1,
            "amenities": ["Gym", "Swimming Pool", "Rooftop Solar Pergola", "Covered Parking", "Smart Automation"]
        },
        "planning": {
            "project_name": "Horizon Heights Commercial & Residential Complex",
            "building_type": "Commercial Office G+4",
            "total_area_sqft": 12500,
            "target_duration_months": 14,
            "finish_grade": "Premium",
            "labor_rate_tier": "Metro High"
        },
        "daily_site": {
            "location_name": "Harbor Terminal Expansion Zone B",
            "temperature_c": 33.5,
            "humidity_pct": 74.0,
            "rain_probability_pct": 45.0,
            "wind_speed_kmh": 32.0,
            "scheduled_activities": [
                "Concrete Pouring - Level 4 Transfer Slab",
                "Tower Crane Hoisting Heavy Steel Trusses",
                "Perimeter Sheet Pile Trench Excavation",
                "Exterior Sealant Application on Curtain Wall"
            ],
            "total_workers_on_site": 54
        },
        "knowledge": {
            "sample_queries": [
                {"query": "What are the minimum curing requirements and testing protocols for high-strength concrete under ACI 308R?", "domain": "Concrete Technology"},
                {"query": "What are the OSHA 1926.501 fall protection mandates for unprotected walking-working edges above 6 feet?", "domain": "Site Safety OSHA"},
                {"query": "Explain the difference between shear vs flexural cracking in reinforced concrete beams and their respective repair codes.", "domain": "Structural Engineering"},
                {"query": "What are the standard wind load design combinations for temporary tower cranes according to ASCE 7-22?", "domain": "Building Codes"}
            ]
        }
    }

@router.get("/dashboard/stats")
async def dashboard_stats():
    return get_dashboard_stats()

@router.get("/history/{module_name}")
async def get_module_history(module_name: str, limit: Optional[int] = 20):
    table_mapping = {
        "safety": "safety_inspections",
        "cracks": "crack_analyses",
        "valuation": "real_estate_valuations",
        "planning": "project_plans",
        "daily-site": "daily_site_reports",
        "knowledge": "knowledge_queries"
    }
    table = table_mapping.get(module_name)
    if not table:
        raise HTTPException(status_code=400, detail=f"Unknown module '{module_name}'. Valid: {list(table_mapping.keys())}")
    
    records = get_records(table, limit=limit)
    return {"module": module_name, "count": len(records), "records": records}
