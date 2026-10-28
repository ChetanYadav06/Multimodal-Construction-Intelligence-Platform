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
    property_location: Optional[str] = "Bengaluru, Whitefield"
    location_tier: Optional[str] = "Tier 1 Suburban"
    built_up_area_sqft: float = 1800.0
    building_age_years: int = 2
    age_years: Optional[int] = 2  # backward compatibility
    property_type: str = "Residential Apartment"
    quality_grade: Optional[str] = "Premium"
    amenities: List[str] = ["Gym", "Swimming Pool", "Underground Parking", "Smart Security", "Power Backup"]
    currency: str = "INR"
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
    property_location: str = "Bengaluru, Whitefield"
    property_type: str = "Residential Apartment"
    built_up_area_sqft: float = 1800.0
    estimated_fair_value: float
    valuation_range_low: float
    valuation_range_high: float
    price_per_sqft: float
    currency: str = "INR"
    currency_symbol: str = "₹"
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
    project_name: Optional[str] = "Surya Heights Villa"
    project_description: Optional[str] = "G+1 duplex residential house with modern elevation and modular spaces"
    plot_length_ft: Optional[float] = 50.0
    plot_width_ft: Optional[float] = 30.0
    plot_dimensions: Optional[str] = "30 ft x 50 ft"
    construction_type: Optional[str] = "Residential"
    building_type: Optional[str] = "Residential G+1"
    city_location: Optional[str] = "Bengaluru"
    total_area_sqft: Optional[float] = 2200.0
    target_duration_months: Optional[int] = 12
    finish_grade: Optional[str] = "Standard"  # Economy, Standard, Premium, Luxury
    labor_rate_tier: Optional[str] = "Standard"
    currency: Optional[str] = "INR"

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

class CoreMaterialsSummary(BaseModel):
    cement: Dict[str, Any]
    sand: Dict[str, Any]
    aggregate: Dict[str, Any]
    steel: Dict[str, Any]

class ArchitecturalPreview(BaseModel):
    layout_type: str
    plot_dimensions: str
    built_up_area_sqft: float
    spatial_zones: List[str]
    structural_column_count: int
    orientation: str
    visualization_svg: str
    concept_notes: str

class PlanningResponse(BaseModel):
    id: str
    timestamp: str
    project_name: str
    project_description: str = ""
    city_location: str = "Bengaluru"
    plot_dimensions: str = "30 ft x 50 ft"
    construction_type: str = "Residential"
    total_area_sqft: float
    target_duration_months: int
    currency: str = "INR"
    currency_symbol: str = "₹"
    cost_breakdown: CostBreakdown
    core_materials_summary: CoreMaterialsSummary
    bill_of_materials: List[MaterialTakeoff]
    schedule_milestones: List[MilestonePhase]
    trade_manpower: List[TradeManpower]
    architectural_preview: ArchitecturalPreview
    executive_summary: str
    risk_mitigation_notes: List[str]


# ----------------- Daily Site & Weather Schemas -----------------
class WeatherActivityInput(BaseModel):
    activity_name: str
    notes: Optional[str] = None

class DailySiteAssistantRequest(BaseModel):
    planned_activity: str = "Level 2 Slab Concrete Pouring"
    labour_count: int = 24
    site_conditions: str = "Dry ground, formwork installed, rebar inspection cleared"
    location_name: Optional[str] = "Site Alpha Sector 4"
    shift_hours: Optional[int] = 8

class DailyTaskItem(BaseModel):
    task_name: str
    trade: str
    duration_hours: float
    allocated_workers: int
    priority: str

class DailySiteAssistantResponse(BaseModel):
    id: str
    timestamp: str
    planned_activity: str
    labour_count: int
    site_conditions: str
    daily_task_breakdown: List[DailyTaskItem]
    required_materials_equipment: List[Dict[str, str]]
    safety_precautions_checks: List[str]
    potential_risk_alerts: List[str]
    summary_directive: str

class WeatherAdvisorRequest(BaseModel):
    location_name: str = "Metro Site"
    temperature_c: float = 29.0
    humidity_pct: float = 65.0
    rain_probability_pct: float = 20.0
    wind_speed_kmh: float = 16.0
    planned_activities: List[str] = [
        "Concrete Pouring - Foundation Footings",
        "Tower Crane Hoisting Steel Girders",
        "Deep Trench Bench Excavation",
        "Exterior Waterproofing & Wall Plastering"
    ]

class ActivityDecision(BaseModel):
    activity: str
    decision: str  # GO, CAUTION, NO-GO
    risk_level: str
    primary_weather_factor: str
    hazard_precautions: List[str]
    mitigation_recommendations: str

class WeatherAdvisorResponse(BaseModel):
    id: str
    timestamp: str
    location_name: str
    temperature_c: float
    humidity_pct: float
    rain_probability_pct: float
    wind_speed_kmh: float
    weather_condition: str
    site_readiness_score: int
    overall_recommendation: str  # GO, CAUTION, NO-GO
    activity_decisions: List[ActivityDecision]
    hazard_precautions: List[str]
    mitigation_recommendations: List[str]
    data_source_note: str

# Legacy DailySiteRequest & Response for backward compatibility
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
    status: str
    risk_level: str
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
    site_safety_index: int
    overall_weather_alert: str
    activity_risk_matrix: List[ActivityRisk]
    daily_site_report_text: str
    recommended_toolbox_talk: str


# ----------------- Chatbot & Knowledge Schemas -----------------
class ChatbotQueryRequest(BaseModel):
    query: str
    domain: Optional[str] = "General Construction"
    conversation_history: Optional[List[Dict[str, str]]] = None

class ChatbotQueryResponse(BaseModel):
    id: str
    timestamp: str
    query: str
    response: str
    actionable_suggestions: List[str]
    relevant_standards: List[str]
    follow_up_prompts: List[str]

# Legacy alias
class KnowledgeQueryRequest(BaseModel):
    query: str
    domain: str = "General Civil & Structural"
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
