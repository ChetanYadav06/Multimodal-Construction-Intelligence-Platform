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

def test_safety_analyze_endpoint():
    response = client.post(
        "/api/safety/analyze",
        data={"notes": "Scaffolding work on 3rd floor, workers wearing vests.", "location_tag": "Block A"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "safety_score" in data
    assert "ppe_compliance" in data
    assert "hazards_identified" in data
    assert data["safety_score"] >= 0 and data["safety_score"] <= 100

def test_crack_analyze_endpoint():
    response = client.post(
        "/api/cracks/analyze",
        data={"structural_element": "Beam", "material": "Reinforced Concrete", "notes": "Diagonal crack near column support"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "crack_type" in data
    assert "severity" in data
    assert "remediation_plan" in data
    assert len(data["remediation_plan"]) > 0

def test_valuation_evaluate_endpoint():
    payload = {
        "property_type": "Residential Apartment",
        "built_up_area_sqft": 2000.0,
        "location_tier": "Tier 1 Suburban",
        "quality_grade": "Premium",
        "age_years": 3,
        "amenities": ["Gym", "Pool", "Parking"],
        "currency": "USD"
    }
    response = client.post("/api/valuation/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["estimated_fair_value"] > 0
    assert len(data["comparable_sales"]) > 0
    assert len(data["appreciation_forecast"]) > 0

def test_planning_generate_endpoint():
    payload = {
        "project_name": "Sunrise Towers",
        "building_type": "Residential G+2",
        "total_area_sqft": 3000.0,
        "target_duration_months": 10,
        "finish_grade": "Standard",
        "labor_rate_tier": "Standard"
    }
    response = client.post("/api/planning/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["bill_of_materials"]) > 0
    assert len(data["schedule_milestones"]) > 0
    assert data["cost_breakdown"]["total_estimated_budget"] > 0

def test_daily_site_advisory_endpoint():
    payload = {
        "date": "2026-10-28",
        "location_name": "Sector 9 Site",
        "temperature_c": 32.0,
        "humidity_pct": 70.0,
        "rain_probability_pct": 65.0,
        "wind_speed_kmh": 42.0,
        "scheduled_activities": [
            "Concrete Pouring - Level 2",
            "Tower Crane Lifting"
        ],
        "total_workers_on_site": 28
    }
    response = client.post("/api/daily-site/advisory", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["activity_risk_matrix"]) == 2
    assert "daily_site_report_text" in data
    assert data["site_safety_index"] <= 70  # Rain & wind should trigger risk deduction

def test_knowledge_query_endpoint():
    payload = {
        "query": "What are the minimum curing requirements for high-strength concrete under ACI 308?",
        "domain": "Concrete Technology"
    }
    response = client.post("/api/knowledge/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer_markdown" in data
    assert len(data["applicable_codes_standards"]) > 0

def test_dashboard_stats():
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_safety_inspections" in data
    assert "total_crack_analyses" in data

