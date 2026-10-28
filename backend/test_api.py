import json
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_api_status():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "ai_engine" in data

# -------------------------------------------------------------
# Activity 3.1: Project Planning Logic Test
# -------------------------------------------------------------
def test_project_planning_activity_3_1():
    payload = {
        "project_name": "Surya Duplex Villa",
        "project_description": "3BHK duplex house with covered parking and modular kitchen",
        "plot_length_ft": 50.0,
        "plot_width_ft": 30.0,
        "plot_dimensions": "30 ft x 50 ft",
        "construction_type": "Residential",
        "city_location": "Bengaluru",
        "total_area_sqft": 2200.0,
        "target_duration_months": 12,
        "finish_grade": "Standard",
        "currency": "INR"
    }
    response = client.post("/api/planning/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Currency in INR
    assert data["currency"] == "INR"
    assert data["currency_symbol"] == "₹"
    assert data["city_location"] == "Bengaluru"
    assert data["cost_breakdown"]["total_estimated_budget"] > 0
    
    # Verify core materials takeoffs
    assert "core_materials_summary" in data
    assert data["core_materials_summary"]["cement"]["quantity"] > 0
    assert data["core_materials_summary"]["sand"]["quantity"] > 0
    assert data["core_materials_summary"]["aggregate"]["quantity"] > 0
    assert data["core_materials_summary"]["steel"]["quantity"] > 0
    
    # Verify phase-wise schedule
    assert len(data["schedule_milestones"]) >= 5
    
    # Verify conceptual architectural preview
    assert "architectural_preview" in data
    assert "visualization_svg" in data["architectural_preview"]
    assert "<svg" in data["architectural_preview"]["visualization_svg"]
    assert len(data["architectural_preview"]["spatial_zones"]) >= 3

# -------------------------------------------------------------
# Activity 3.2: Real Estate Valuation Engine Test
# -------------------------------------------------------------
def test_real_estate_valuation_activity_3_2():
    payload = {
        "property_location": "Bengaluru, Whitefield",
        "built_up_area_sqft": 1650.0,
        "building_age_years": 2,
        "property_type": "Residential Apartment",
        "quality_grade": "Premium",
        "amenities": ["Power Backup", "Covered Parking", "Swimming Pool"],
        "currency": "INR"
    }
    response = client.post("/api/valuation/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Indian Rupees verification
    assert data["currency"] == "INR"
    assert data["currency_symbol"] == "₹"
    assert data["estimated_fair_value"] > 0
    assert data["price_per_sqft"] > 0
    assert data["monthly_rental_estimate"] > 0
    assert data["rental_yield_estimate_pct"] > 0
    assert len(data["appreciation_forecast"]) == 5
    assert len(data["comparable_sales"]) >= 2
    assert "swot_analysis" in data

def test_valuation_fallback_partial_inputs():
    # Test partial / minimal inputs fallback
    payload = {
        "property_location": "Pune",
        "built_up_area_sqft": 1200.0
    }
    response = client.post("/api/valuation/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_fair_value"] > 0
    assert data["property_type"] is not None

# -------------------------------------------------------------
# Activity 4.1 & 4.3: Centralized Multimodal AI Handler Test
# -------------------------------------------------------------
def test_centralized_ai_process_planning():
    form_data = {
        "feature": "project_planning",
        "payload": json.dumps({"city_location": "Mumbai", "total_area_sqft": 1500.0, "finish_grade": "Premium"})
    }
    response = client.post("/api/ai/process", data=form_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["feature"] == "project_planning"
    assert "cost_breakdown" in data["result"]

def test_centralized_ai_process_valuation():
    form_data = {
        "feature": "real_estate_valuation",
        "payload": json.dumps({"property_location": "Delhi NCR", "built_up_area_sqft": 2000.0})
    }
    response = client.post("/api/ai/process", data=form_data)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "estimated_fair_value" in data["result"]

# -------------------------------------------------------------
# Activity 5.1: Construction Chatbot Test
# -------------------------------------------------------------
def test_construction_chatbot_activity_5_1():
    payload = {
        "query": "What is the minimum curing period for M25 grade concrete under IS 456?",
        "domain": "Concrete Technology"
    }
    response = client.post("/api/chatbot/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 50
    assert "actionable_suggestions" in data
    assert "relevant_standards" in data

# -------------------------------------------------------------
# Activity 5.2: Daily Site Assistant Test
# -------------------------------------------------------------
def test_daily_site_assistant_activity_5_2():
    payload = {
        "planned_activity": "Level 2 Slab Concrete Pouring",
        "labour_count": 25,
        "site_conditions": "Dry ground, formwork installed, rebar inspection sign-off obtained",
        "location_name": "Sector 4B",
        "shift_hours": 8
    }
    response = client.post("/api/daily-assistant/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["daily_task_breakdown"]) >= 3
    assert len(data["required_materials_equipment"]) >= 2
    assert len(data["safety_precautions_checks"]) >= 2
    assert len(data["potential_risk_alerts"]) >= 1
    assert "summary_directive" in data

# -------------------------------------------------------------
# Activity 5.3: Weather-Aware Construction Advisory Test
# -------------------------------------------------------------
def test_weather_advisor_activity_5_3():
    payload = {
        "location_name": "Harbor Terminal Expansion",
        "temperature_c": 34.0,
        "humidity_pct": 75.0,
        "rain_probability_pct": 65.0,
        "wind_speed_kmh": 42.0,
        "planned_activities": [
            "Concrete Pouring - Level 3 Slab",
            "Tower Crane Lifting Heavy Precast Panels"
        ]
    }
    response = client.post("/api/weather-advisor/advisory", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["overall_recommendation"] in ["GO", "CAUTION", "NO-GO"]
    assert len(data["activity_decisions"]) == 2
    assert "data_source_note" in data

# -------------------------------------------------------------
# Site Safety Monitoring & Crack Detection Tests
# -------------------------------------------------------------
def test_safety_analyze_endpoint():
    response = client.post(
        "/api/safety/analyze",
        data={"notes": "Scaffolding work on 3rd floor, workers wearing vests.", "location_tag": "Block A"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "safety_score" in data
    assert "ppe_compliance" in data

def test_crack_analyze_endpoint():
    response = client.post(
        "/api/cracks/analyze",
        data={"structural_element": "Beam", "material": "Reinforced Concrete", "notes": "Diagonal shear crack"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "crack_type" in data
    assert len(data["remediation_plan"]) > 0

def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_safety_inspections" in data

# -------------------------------------------------------------
# Activity 6.2: Edge-Case and Error Handling Tests
# -------------------------------------------------------------
def test_edge_case_invalid_ai_feature():
    form_data = {
        "feature": "non_existent_feature_xyz",
        "payload": json.dumps({"test": "data"})
    }
    response = client.post("/api/ai/process", data=form_data)
    assert response.status_code == 400
    detail = response.json()["detail"]
    assert "Unknown feature" in detail or "Unsupported feature" in detail

def test_edge_case_malformed_ai_payload():
    form_data = {
        "feature": "project_planning",
        "payload": "{invalid_json_format:::"
    }
    response = client.post("/api/ai/process", data=form_data)
    assert response.status_code == 400
    assert "Malformed JSON" in response.json()["detail"]

def test_edge_case_planning_zero_area_recovery():
    # If 0 or negative area is passed, the engine safely normalizes or computes based on plot dimensions
    payload = {
        "project_name": "Zero Area Test",
        "plot_length_ft": 40.0,
        "plot_width_ft": 25.0,
        "total_area_sqft": 0.0
    }
    response = client.post("/api/planning/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["cost_breakdown"]["total_estimated_budget"] > 0
    assert data["total_area_sqft"] > 0

def test_edge_case_extreme_weather_inputs():
    # Test extreme negative temperature, typhoon wind speed
    payload = {
        "location_name": "High Altitude Glacier Site",
        "temperature_c": -15.0,
        "humidity_pct": 98.0,
        "rain_probability_pct": 95.0,
        "wind_speed_kmh": 85.0,
        "planned_activities": ["Concrete Pouring", "Craning High Altitude Steel"]
    }
    response = client.post("/api/weather-advisor/advisory", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["overall_recommendation"] == "NO-GO"
    for dec in data["activity_decisions"]:
        assert dec["decision"] == "NO-GO"

def test_edge_case_empty_chatbot_prompt_fallback():
    payload = {
        "query": "   ",
        "domain": ""
    }
    response = client.post("/api/chatbot/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0
