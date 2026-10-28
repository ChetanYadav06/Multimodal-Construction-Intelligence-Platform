# Functional Requirements Specification (FRS)
## Multimodal Construction Intelligence Platform

### 1. Executive Summary & Lifecycle Stage Analysis
The **Multimodal Construction Intelligence Platform** is an enterprise-grade AI decision support system designed to assist construction managers, structural engineers, safety inspectors, project estimators, and real estate professionals across the four major construction lifecycle stages:

1. **Planning & Pre-Construction:**
   - *Challenges:* Inaccurate manual material takeoffs, budgeting overruns, ambiguous milestone planning, and subjective property valuation.
   - *Platform Solution:* Automated bill of materials (BOM), cost breakdowns, dynamic Gantt task scheduling, and multimodal real estate valuation.

2. **Execution & Daily Operations:**
   - *Challenges:* Weather delays, adverse site conditions (rain during concrete pours, high winds for tower cranes), disconnected daily logging.
   - *Platform Solution:* Intelligent daily weather advisory, activity-specific risk flagging, and automated Daily Site Report (DSR) logging.

3. **Monitoring, Safety & Quality Control:**
   - *Challenges:* High workplace accident rates, unspotted PPE non-compliance, manual inspection oversights, structural crack misdiagnoses.
   - *Platform Solution:* Vision-based PPE and hazard detection, structural crack taxonomy classification, severity scoring, and remediation recommendations.

4. **Reporting & Technical Guidance:**
   - *Challenges:* Dispersed standards, complex building codes (IBC, ACI, OSHA, Eurocodes), delays in technical decision-making.
   - *Platform Solution:* Multimodal Construction Knowledge Assistant with conversational engineering reference.

---

### 2. Functional Requirements (FR)

| ID | Feature Module | Input Parameters | Output & Capabilities |
|---|---|---|---|
| **FR-1** | **Site Safety Monitoring** | Site photo/image, optional area name, active trades | PPE compliance checklist (helmets, vests, boots, gloves, goggles, harnesses), identified hazards with bounding coordinates/descriptions, safety score (0-100), severity level, OSHA regulation references, immediate corrective actions. |
| **FR-2** | **Structural Crack Detection** | Element image (beam, column, slab, wall), surface material, approximate width/history | Crack classification (hairline, structural shear, flexural, settlement, shrinkage), severity rating (Low, Medium, High, Critical), probable root causes, risk score, recommended structural remediation (epoxy injection, carbon wrap, underpinning). |
| **FR-3** | **Real Estate Valuation** | Property photos, built-up area (sq ft/m²), property type, location tier, age, quality grade, amenities | Estimated fair market value & range, price per unit area, comparable market analysis (comps), 5-year appreciation forecast, rental yield, and investment risk score. |
| **FR-4** | **Project Planning & Estimation** | Total area, building type (residential, commercial, industrial), finish grade (standard, premium, luxury), timeline | Quantity takeoff (cement, steel, aggregate, bricks, tiles, paint), cost breakdown (labor, materials, plant/equipment, permits, contingency), milestone schedule with dependencies & critical path. |
| **FR-5** | **Daily Site & Weather Advisory** | Location, weather parameters (temperature, humidity, precipitation, wind speed), scheduled activities | Activity risk matrix (concrete pour, crane work, excavation, exterior painting), advisory warnings, automated Daily Site Report (DSR) generation with crew and equipment logs. |
| **FR-6** | **Construction Knowledge Assistant** | Natural language queries, optional code context or drawings | Accurate engineering explanations, standard citations (OSHA 1926, ACI 318, IBC), best practices, calculation formulas. |

---

### 3. Non-Functional Requirements (NFR)

- **Performance & Latency:** Real-time multimodal analysis response under 5 seconds for Groq vision models; client UI responsive at 60 FPS.
- **Reliability & Fallback:** Dual AI provider fallback architecture (Groq SDK primary, Gemini / intelligent heuristic fallback) ensuring zero downtime if API keys or rate limits fluctuate.
- **Security & Data Privacy:** Secure environment variable management via `.env`, CORS restrictions, file validation (MIME types: JPEG, PNG, WEBP; max 10MB).
- **Usability & Design:** Modern civil engineering dashboard with dark/light theme, high-contrast indicators, Lucide icons, responsive layout for desktop/tablet site tablets, and one-click demo samples for immediate testing.
- **Data Persistence:** SQLite and local file storage for tracking inspection history, planning estimates, and daily logs.

---

### 4. Input & Output Data Schemas (JSON)

#### 4.1 Safety Inspection Schema
```json
{
  "safety_score": 82,
  "risk_level": "Medium",
  "ppe_compliance": [
    {"item": "Hard Hat", "status": "Compliant", "detected_count": 4, "missing_count": 1},
    {"item": "High-Visibility Vest", "status": "Compliant", "detected_count": 5, "missing_count": 0},
    {"item": "Safety Boots", "status": "Compliant", "detected_count": 5, "missing_count": 0},
    {"item": "Fall Arrest Harness", "status": "Non-Compliant", "detected_count": 0, "missing_count": 1}
  ],
  "hazards_identified": [
    {
      "hazard": "Worker near unprotected floor opening without harness",
      "severity": "High",
      "osha_standard": "OSHA 1926.501(b)(1) Fall Protection",
      "location_in_frame": "Upper right scaffolding level",
      "immediate_action": "Halt work at height; install temporary perimeter guardrails and anchor lanyard immediately."
    }
  ],
  "overall_summary": "Site exhibits good general PPE adherence but critical fall protection violation detected at elevation.",
  "recommended_actions": [
    "Conduct immediate toolbox talk on fall prevention",
    "Inspect edge barricades before resuming high-elevation trades"
  ]
}
```

#### 4.2 Structural Crack Analysis Schema
```json
{
  "crack_type": "Diagonal Structural Shear Crack",
  "severity": "High",
  "risk_score": 78,
  "structural_element": "Reinforced Concrete Shear Wall / Beam Junction",
  "estimated_width_mm": "2.5 - 3.5 mm",
  "probable_causes": [
    "Excessive diagonal shear stress exceeding concrete tensile strength",
    "Differential foundation settlement along northern footings",
    "Inadequate shear stirrup spacing"
  ],
  "safety_implication": "Potential loss of shear capacity; requires urgent structural engineer review.",
  "remediation_plan": [
    {"step": 1, "action": "Install crack monitoring gauges to record active propagation over 14 days."},
    {"step": 2, "action": "Low-pressure epoxy resin injection to seal internal voids."},
    {"step": 3, "action": "Apply externally bonded Carbon Fiber Reinforced Polymer (CFRP) wrap for shear strengthening."}
  ]
}
```

---

### 5. Architectural Alignment
The platform strictly decouples the FastAPI backend logic (providing clean RESTful endpoints) from the React.js Vite frontend. The backend handles multimodal processing, prompt engineering, structured validation via Pydantic, and local persistence.

