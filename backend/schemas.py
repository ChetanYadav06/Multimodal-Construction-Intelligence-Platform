from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ----------------- Safety Schemas -----------------
class PPEItem(BaseModel):
    item: str
    status: str  # Compliant, Non-Compliant, Not Applicable
    detected_count: int = 0
    missing_count: int = 0
    confidence: float = 0.95

class HazardItem(BaseModel):
    hazard: str
    severity: str  # Low, Medium, High, Critical
    osha_standard: str
    location_in_frame: str
    immediate_action: str

class SafetyAnalysisResponse(BaseModel):
    id: str
    timestamp: str
    image_url: Optional[str] = None
    safety_score: int  # 0-100
    risk_level: str  # Low, Medium, High, Critical
    compliance_status: str  # Compliant, Warning, Violation
    ppe_compliance: List[PPEItem]
    hazards_identified: List[HazardItem]
    overall_summary: str
    recommended_actions: List[str]
    inspector_notes: Optional[str] = None


# ----------------- Crack Analysis Schemas -----------------
class RemediationStep(BaseModel):
    step: int
    technique: str
    description: str
    urgency: str  # Immediate, 1-2 Weeks, Routine Maintenance

class CrackAnalysisResponse(BaseModel):
    id: str
    timestamp: str
    image_url: Optional[str] = None
    crack_type: str
    severity: str  # Low, Medium, High, Critical
    risk_score: int  # 0-100
    structural_element: str
    estimated_width_mm: str
    crack_orientation: str
    is_structural_hazard: bool
    probable_causes: List[str]
    structural_implication: str
    remediation_plan: List[RemediationStep]
    monitoring_recommendation: str


# ----------------- Real Estate Valuation Schemas -----------------
class ValuationRequest(BaseModel):
    property_type: str = "Residential Apartment"
    built_up_area_sqft: float = 2400.0
    location_tier: str = "Tier 1 Suburban"
    quality_grade: str = "Premium"
    age_years: int = 2
    amenities: List[str] = ["Gym", "Swimming Pool", "Underground Parking", "Smart Security"]
    currency: str = "USD"
    notes: Optional[str] = ""

class ComparableSale(BaseModel):
    property_name: str
    distance_miles: float
    sale_price: float
    price_per_sqft: float
    similarity_score: int

class AppreciationYear(BaseModel):
    year: int
    projected_value: float
    growth_rate_pct: float

class ValuationResponse(BaseModel):
    id: str
    timestamp: str
    image_url: Optional[str] = None
    estimated_fair_value: float
    valuation_range_low: float
    valuation_range_high: float
    price_per_sqft: float
    currency: str
    comparable_sales: List[ComparableSale]
    appreciation_forecast: List[AppreciationYear]
    rental_yield_estimate_pct: float
    monthly_rental_estimate: float
    investment_score: int  # 0-100
    market_sentiment: str
    swot_analysis: Dict[str, List[str]]
    valuation_summary: str


# ----------------- Project Planning Schemas -----------------
class PlanningRequest(BaseModel):
    project_name: str = "Skyline Residence Phase 1"
    building_type: str = "Residential G+2"
    total_area_sqft: float = 4500.0
    target_duration_months: int = 12
    finish_grade: str = "Standard"  # Economy, Standard, Premium, Luxury
    labor_rate_tier: str = "Standard"  # Standard, Metro High

class MaterialTakeoff(BaseModel):
    item: str
    category: str  # Structural, Masonry, Finishing, MEP
    quantity: float
    unit: str
    unit_rate: float
    total_cost: float
    benchmark_ratio: str

class MilestonePhase(BaseModel):
    phase_name: str
    start_week: int
    duration_weeks: int
    end_week: int
    completion_pct: int
    critical_path: bool
    key_deliverables: List[str]

class CostBreakdown(BaseModel):
    material_cost: float
    labor_cost: float
    equipment_machinery_cost: float
    permits_and_compliance_cost: float
    contingency_cost: float
    total_estimated_budget: float

class TradeManpower(BaseModel):
    trade: str
    peak_workers: int
    total_man_days: int

class PlanningResponse(BaseModel):
    id: str
    timestamp: str
    project_name: str
    total_area_sqft: float
    target_duration_months: int
    cost_breakdown: CostBreakdown
    bill_of_materials: List[MaterialTakeoff]
    schedule_milestones: List[MilestonePhase]
    trade_manpower: List[TradeManpower]
    executive_summary: str
    risk_mitigation_notes: List[str]


# ----------------- Daily Site & Weather Schemas -----------------
class WeatherActivityInput(BaseModel):
    activity_name: str
    notes: Optional[str] = None

class DailySiteRequest(BaseModel):
    date: str
    location_name: str = "Metro Site Sector 4"
    temperature_c: float = 28.5
    humidity_pct: float = 65.0
    rain_probability_pct: float = 15.0
    wind_speed_kmh: float = 18.0
    weather_condition: str = "Partly Cloudy"
    scheduled_activities: List[str] = [
        "Concrete Pouring - Level 3 Slab",
        "Tower Crane Hoisting Precast Panels",
        "Deep Foundation Trench Excavation",
        "Exterior Waterproofing & Facade Sealing"
    ]
    total_workers_on_site: int = 42

class ActivityRisk(BaseModel):
    activity: str
    status: str  # Safe to Proceed, Proceed with Caution, Reschedule / Halt
    risk_level: str  # Low, Moderate, High, Severe
    primary_weather_factor: str
    safety_precautions: List[str]
    allowed_operating_window: str

class DailySiteResponse(BaseModel):
    id: str
    timestamp: str
    date: str
    location_name: str
    weather_condition: str
    temperature_c: float
    humidity_pct: float
    rain_probability_pct: float
    wind_speed_kmh: float
    site_safety_index: int  # 0-100
    overall_weather_alert: str
    activity_risk_matrix: List[ActivityRisk]
    daily_site_report_text: str
    recommended_toolbox_talk: str


# ----------------- Knowledge Assistant Schemas -----------------
class KnowledgeQueryRequest(BaseModel):
    query: str
    domain: str = "General Civil & Structural"  # Structural Engineering, Building Codes, Concrete Tech, Site Safety OSHA, Construction Management
    detail_level: str = "Comprehensive"

class KnowledgeQueryResponse(BaseModel):
    id: str
    timestamp: str
    query: str
    domain: str
    answer_markdown: str
    applicable_codes_standards: List[str]
    key_recommendations: List[str]
    critical_formulas: Optional[List[str]] = None
    follow_up_questions: List[str]

