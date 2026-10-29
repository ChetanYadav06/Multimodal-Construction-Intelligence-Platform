import os
import sys
import json
import tempfile
from pathlib import Path
import streamlit as st
from PIL import Image

# Ensure project root is in python path
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(ROOT_DIR / ".env")
except Exception:
    pass

# Synchronize Streamlit secrets with os.environ if running on Streamlit Cloud
try:
    if hasattr(st, "secrets"):
        for key in ["GROQ_API_KEY", "GEMINI_API_KEY"]:
            try:
                if key in st.secrets and not os.environ.get(key):
                    os.environ[key] = str(st.secrets[key])
            except Exception:
                pass
except Exception:
    pass

# Import AI Engine Services
try:
    from backend.ai_service import (
        analyze_safety,
        analyze_crack,
        generate_project_plan,
        analyze_real_estate,
        analyze_daily_site_assistant,
        analyze_weather_advisor,
        query_chatbot
    )
except ImportError as e:
    st.error(f"Failed to load backend AI modules: {e}")

# Streamlit Page Configuration
st.set_page_config(
    page_title="Multimodal Construction Intelligence Platform",
    page_icon="🏗️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Professional Civil Engineering UI
st.markdown("""
<style>
    .main-header {
        font-size: 2.1rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.05rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .metric-value {
        font-size: 1.6rem;
        font-weight: 700;
        color: #0f172a;
    }
    .metric-label {
        font-size: 0.85rem;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .badge-go {
        background-color: #dcfce7;
        color: #15803d;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-block;
    }
    .badge-caution {
        background-color: #fef9c3;
        color: #a16207;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-block;
    }
    .badge-nogo {
        background-color: #fee2e2;
        color: #b91c1c;
        padding: 4px 10px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        display: inline-block;
    }
</style>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# Sidebar Navigation & Settings
# -------------------------------------------------------------
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80", width=280)
    st.title("🏗️ Construction AI")
    st.caption("Multimodal Intelligence Platform")

    nav_selection = st.radio(
        "Navigation Modules",
        [
            "📊 Dashboard Overview",
            "🦺 Site Safety Monitoring",
            "🔍 Structural Crack Detection",
            "📐 Construction Project Planning",
            "🏢 Real Estate Valuation",
            "📋 Daily Site Assistant",
            "⛅ Weather-Aware Advisory",
            "💬 Construction Chatbot (IS/OSHA)"
        ]
    )

    st.markdown("---")
    st.subheader("🔑 AI Credentials")
    user_groq_key = st.text_input("Groq API Key (Optional)", type="password", value=os.environ.get("GROQ_API_KEY", ""))
    user_gemini_key = st.text_input("Gemini API Key (Optional)", type="password", value=os.environ.get("GEMINI_API_KEY", ""))

    if user_groq_key:
        os.environ["GROQ_API_KEY"] = user_groq_key
    if user_gemini_key:
        os.environ["GEMINI_API_KEY"] = user_gemini_key

    if not user_groq_key and not user_gemini_key:
        st.info("💡 Built-in deterministic engineering models are active for offline/instant evaluation.")

    st.markdown("---")
    st.caption("Indian Standard Codes (IS 456, IS 1893, NBC 2016) & OSHA 1926 Compliant.")

# Helper to format INR
def format_inr(val):
    try:
        val = float(val)
        return f"₹{int(val):,}"
    except Exception:
        return f"₹{val}"

# -------------------------------------------------------------
# Module 1: Dashboard Overview
# -------------------------------------------------------------
if nav_selection == "📊 Dashboard Overview":
    st.markdown('<div class="main-header">Civil Engineering & Construction Intelligence Dashboard</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Unified AI-powered decision support system for civil engineers, site managers, and real estate developers.</div>', unsafe_allow_html=True)

    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown("""
        <div class="metric-card">
            <div class="metric-value">94.8%</div>
            <div class="metric-label">Safety Compliance Index</div>
        </div>
        """, unsafe_allow_html=True)
    with c2:
        st.markdown("""
        <div class="metric-card">
            <div class="metric-value">₹2,450</div>
            <div class="metric-label">Avg Construction Cost/Sqft</div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        st.markdown("""
        <div class="metric-card">
            <div class="metric-value">0.12 mm</div>
            <div class="metric-label">Avg Defect Threshold</div>
        </div>
        """, unsafe_allow_html=True)
    with c4:
        st.markdown("""
        <div class="metric-card">
            <div class="metric-value">IS 456 / OSHA</div>
            <div class="metric-label">Governing Code Standards</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("### 🚀 Quick Access Modules")
    q1, q2, q3 = st.columns(3)
    with q1:
        st.info("#### 🦺 Site Safety\nInspect construction images for hard hats, high-vis vests, scaffolding hazards, and OSHA compliance.")
    with q2:
        st.info("#### 🔍 Structural Cracks\nClassify shear, flexural, or shrinkage cracks, compute severity, and generate structural repair protocols.")
    with q3:
        st.info("#### 📐 Project Planner\nCalculate cement bags, sand, aggregate, Fe550D steel, INR budget breakdown, and 2D spatial layouts.")

    st.markdown("### 📌 Active Platform Capabilities")
    st.markdown("""
    - **Real-time Multimodal Vision:** Computer vision for PPE tracking and structural pathology.
    - **Indian Rupee (₹) Cost Modeling:** Accurate localized pricing for Tier 1 and Tier 2 metro regions.
    - **Dynamic Blueprint Rendering:** Generates SVG conceptual blueprints with spatial room zoning and column grids.
    - **Weather Activity Risk Matrix:** Validates site safety against wind shear, high precipitation, and extreme heat.
    """)

# -------------------------------------------------------------
# Module 2: Site Safety Monitoring
# -------------------------------------------------------------
elif nav_selection == "🦺 Site Safety Monitoring":
    st.markdown('<div class="main-header">Construction Site Safety & PPE Monitoring</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Multimodal visual inspection for PPE compliance, fall protection, and site hazard identification.</div>', unsafe_allow_html=True)

    uploaded_file = st.file_uploader("Upload Construction Site Image (JPG, PNG, WEBP)", type=["jpg", "jpeg", "png", "webp"])
    site_notes = st.text_input("Site Inspection Notes", placeholder="e.g. Scaffolding erection on Block B, 4th floor slab")

    temp_image_path = None
    if uploaded_file:
        img = Image.open(uploaded_file)
        st.image(img, caption="Site Inspection Image", width=500)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            img.save(tmp.name)
            temp_image_path = Path(tmp.name)

    if st.button("Run Safety Inspection", type="primary"):
        with st.spinner("Analyzing site imagery with multimodal vision model..."):
            try:
                res = analyze_safety(image_path=temp_image_path, notes=site_notes)
                
                score = res.get("safety_score", 85)
                score_color = "green" if score >= 80 else ("orange" if score >= 60 else "red")

                st.subheader("Inspection Results")
                m1, m2, m3 = st.columns(3)
                m1.metric("Safety Score", f"{score}/100")
                m2.metric("Compliance Status", res.get("overall_status", "Compliant"))
                m3.metric("Detected Hazards", len(res.get("hazards_detected", [])))

                ppe = res.get("ppe_compliance", {})
                st.markdown("#### 🦺 PPE Compliance Breakdown")
                p1, p2, p3, p4 = st.columns(4)
                p1.metric("Hard Hats", "Compliant" if ppe.get("hard_hats") else "Missing", delta=None)
                p2.metric("High-Vis Vests", "Compliant" if ppe.get("vests") else "Missing", delta=None)
                p3.metric("Safety Boots", "Compliant" if ppe.get("boots") else "Missing", delta=None)
                p4.metric("Fall Harnesses", "Compliant" if ppe.get("harnesses") else "Missing", delta=None)

                st.markdown("#### ⚠️ Identified Hazards")
                for h in res.get("hazards_detected", []):
                    st.error(f"• **{h.get('type', 'Hazard')}** ({h.get('severity', 'Medium')} Severity): {h.get('description', '')}")

                st.markdown("#### 📋 Recommended Corrective Actions")
                for act in res.get("corrective_actions", []):
                    st.success(f"✔ {act}")

            except Exception as e:
                st.error(f"Error during safety analysis: {e}")

# -------------------------------------------------------------
# Module 3: Structural Crack Detection
# -------------------------------------------------------------
elif nav_selection == "🔍 Structural Crack Detection":
    st.markdown('<div class="main-header">Structural Crack Detection & Remediation Engine</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">AI diagnostic tool for identifying crack classification, structural severity, and repair protocols.</div>', unsafe_allow_html=True)

    c1, c2 = st.columns(2)
    with c1:
        structural_elem = st.selectbox("Structural Element", ["Beam", "Column", "Slab", "Shear Wall", "Retaining Wall", "Foundation"])
    with c2:
        material_type = st.selectbox("Material Type", ["Reinforced Concrete (RCC)", "Prestressed Concrete", "Brick Masonry", "AAC Block Masonry"])

    uploaded_crack = st.file_uploader("Upload Crack Image", type=["jpg", "jpeg", "png", "webp"])
    crack_notes = st.text_input("Observation Notes", placeholder="e.g. 45-degree diagonal crack near column support, width ~1.5mm")

    temp_crack_path = None
    if uploaded_crack:
        cimg = Image.open(uploaded_crack)
        st.image(cimg, caption="Inspected Element", width=500)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            cimg.save(tmp.name)
            temp_crack_path = Path(tmp.name)

    if st.button("Diagnose Structural Crack", type="primary"):
        with st.spinner("Analyzing structural crack morphology and load patterns..."):
            try:
                res = analyze_crack(
                    image_path=temp_crack_path,
                    structural_element=structural_elem,
                    material=material_type,
                    notes=crack_notes
                )

                st.subheader("Diagnostic Report")
                r1, r2, r3 = st.columns(3)
                r1.metric("Crack Classification", res.get("crack_type", "Shear Crack"))
                r2.metric("Severity Level", res.get("severity_level", "High"))
                r3.metric("Structural Risk", res.get("structural_risk", "Needs Immediate Attention"))

                st.markdown(f"**Probable Cause:** {res.get('probable_cause', 'Shear stress concentration near support')}")

                st.markdown("#### 🛠️ Remediation & Repair Plan")
                for step in res.get("remediation_plan", []):
                    st.info(f"• {step}")

                st.caption(f"Applicable Standards: {', '.join(res.get('relevant_standards', ['IS 456:2000', 'ACI 224.1R']))}")
            except Exception as e:
                st.error(f"Error during crack analysis: {e}")

# -------------------------------------------------------------
# Module 4: Project Planning Logic (Activity 3.1)
# -------------------------------------------------------------
elif nav_selection == "📐 Construction Project Planning":
    st.markdown('<div class="main-header">Construction Project Planning & Takeoff Engine</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Compute civil material estimates, Indian Rupee (₹) budgets, timelines, and conceptual architectural layouts.</div>', unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        p_name = st.text_input("Project Name", "Duplex Villa - Sector 18")
        p_desc = st.text_area("Project Description", "G+1 duplex residential bungalow with RCC framed structure, modular kitchen, and covered car porch.")
        const_type = st.selectbox("Construction Type", ["Residential", "Commercial", "Industrial", "Institutional"])
    with col2:
        c_city = st.selectbox("Location / City (for Indian Rate Analysis)", ["Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad", "Chennai", "Kolkata", "Tier 2 / Tier 3 City"])
        p_len = st.number_input("Plot Length (ft)", min_value=10.0, value=50.0, step=5.0)
        p_wid = st.number_input("Plot Width (ft)", min_value=10.0, value=30.0, step=5.0)
        calc_area = p_len * p_wid
        f_grade = st.selectbox("Finish Grade", ["Standard", "Premium", "Luxury"])

    if st.button("Generate Construction Plan & Estimates", type="primary"):
        with st.spinner("Calculating material takeoffs and structural timeline..."):
            try:
                res = generate_project_plan(
                    project_name=p_name,
                    description=p_desc,
                    plot_length=p_len,
                    plot_width=p_wid,
                    construction_type=const_type,
                    city_location=c_city,
                    finish_grade=f_grade
                )

                st.success("Plan Generated Successfully!")

                # Core Materials Takeoff
                st.subheader("📦 Core Civil Materials Summary")
                mats = res.get("core_materials_summary", {})
                m1, m2, m3, m4 = st.columns(4)
                
                cem = mats.get("cement", {})
                m1.metric("Cement", f"{cem.get('quantity', 0)} bags", f"₹{cem.get('rate_inr', 410)}/bag")
                
                snd = mats.get("sand", {})
                m2.metric("Sand", f"{snd.get('quantity', 0)} cu.ft", f"₹{snd.get('rate_inr', 65)}/cft")
                
                agg = mats.get("aggregate", {})
                m3.metric("Aggregate", f"{agg.get('quantity', 0)} cu.ft", f"₹{agg.get('rate_inr', 52)}/cft")
                
                stl = mats.get("steel", {})
                m4.metric("TMT Steel Fe550D", f"{stl.get('quantity', 0)} tonnes", f"₹{stl.get('rate_inr', 72000)}/t")

                # Budget Breakdown
                st.subheader("💰 Cost Breakdown in Indian Rupees (₹)")
                costs = res.get("cost_breakdown", {})
                tot_budget = costs.get("total_estimated_budget", 0)
                
                b1, b2, b3 = st.columns(3)
                b1.metric("Total Budget", format_inr(tot_budget))
                b2.metric("Built-up Area", f"{res.get('total_area_sqft', calc_area):,.0f} sq.ft")
                b3.metric("Unit Cost", f"₹{costs.get('cost_per_sqft', 0):,.0f}/sq.ft")

                st.markdown("#### Major Cost Heads:")
                cb_cols = st.columns(4)
                cb_cols[0].write(f"**Structural Shell:** {format_inr(costs.get('structural_concrete_steel', 0))}")
                cb_cols[1].write(f"**Masonry & Plaster:** {format_inr(costs.get('masonry_and_plaster', 0))}")
                cb_cols[2].write(f"**Electrical & Plumbing:** {format_inr(costs.get('mep_electrical_plumbing', 0))}")
                cb_cols[3].write(f"**Finishing & Painting:** {format_inr(costs.get('finishes_flooring_painting', 0))}")

                # Architectural Blueprint Preview (SVG)
                st.subheader("🏛️ Conceptual Architectural Preview (SVG Layout)")
                arch = res.get("architectural_preview", {})
                svg_code = arch.get("visualization_svg", "")
                if svg_code:
                    st.components.v1.html(svg_code, height=450, scrolling=True)
                else:
                    st.info("No SVG blueprint generated.")

                # Phase Schedule
                st.subheader("📅 Construction Schedule & Milestones")
                for mile in res.get("schedule_milestones", []):
                    st.write(f"• **Phase {mile.get('phase', '')}: {mile.get('task_name', '')}** — Duration: {mile.get('duration_weeks', 2)} weeks | *{mile.get('deliverables', '')}*")

            except Exception as e:
                st.error(f"Error during project planning: {e}")

# -------------------------------------------------------------
# Module 5: Real Estate Valuation (Activity 3.2)
# -------------------------------------------------------------
elif nav_selection == "🏢 Real Estate Valuation":
    st.markdown('<div class="main-header">AI Real Estate Valuation Engine</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Compute fair market price, price/sqft, rental yields, and 5-year capital appreciation in INR (₹).</div>', unsafe_allow_html=True)

    v1, v2 = st.columns(2)
    with v1:
        prop_loc = st.text_input("Property Location / Neighborhood", "Bengaluru, Whitefield")
        built_area = st.number_input("Built-up Area (sq.ft)", min_value=100.0, value=1500.0, step=50.0)
        b_age = st.number_input("Building Age (Years)", min_value=0, max_value=80, value=2)
    with v2:
        p_type = st.selectbox("Property Type", ["Residential Apartment", "Independent Villa", "Commercial Office", "Retail Space", "Plot / Land"])
        q_grade = st.selectbox("Quality / Spec Grade", ["Standard", "Premium", "Ultra Luxury"])
        amenities = st.multiselect("Key Amenities", ["Covered Parking", "Power Backup", "Gym & Clubhouse", "Swimming Pool", "24/7 Security", "EV Charging Point", "Metro Proximity"], default=["Covered Parking", "Power Backup", "24/7 Security"])

    if st.button("Evaluate Property Valuation", type="primary"):
        with st.spinner("Analyzing regional sales comparables and micro-market appreciation trends..."):
            try:
                res = analyze_real_estate(
                    location=prop_loc,
                    area_sqft=built_area,
                    age_years=b_age,
                    prop_type=p_type,
                    grade=q_grade,
                    amenities=amenities
                )

                st.subheader("Valuation Summary")
                val1, val2, val3, val4 = st.columns(4)
                val1.metric("Fair Market Value", format_inr(res.get("estimated_fair_value", 0)))
                val2.metric("Rate / Sq.Ft", f"₹{res.get('price_per_sqft', 0):,.0f}")
                val3.metric("Est. Monthly Rent", format_inr(res.get("monthly_rental_estimate", 0)))
                val4.metric("Rental Yield", f"{res.get('rental_yield_estimate_pct', 3.8)}% p.a.")

                st.info(f"**Value Range:** {format_inr(res.get('fair_value_range_min', 0))} – {format_inr(res.get('fair_value_range_max', 0))}")

                st.markdown("#### 📈 5-Year Capital Appreciation Outlook")
                app_list = res.get("appreciation_forecast", [])
                if app_list:
                    app_df = {
                        "Year": [f"Year {item.get('year')}" for item in app_list],
                        "Projected Value": [format_inr(item.get("projected_value_inr")) for item in app_list],
                        "Expected Annual Growth": [f"{item.get('growth_rate_pct')}%" for item in app_list]
                    }
                    st.table(app_df)

                st.markdown("#### ⚖️ SWOT Property Insights")
                swot = res.get("swot_analysis", {})
                s1, s2 = st.columns(2)
                with s1:
                    st.success("**Strengths:** " + ", ".join(swot.get("strengths", ["Prime location", "Solid structural grade"])))
                    st.warning("**Weaknesses:** " + ", ".join(swot.get("weaknesses", ["Traffic congestion during peak hours"])))
                with s2:
                    st.info("**Opportunities:** " + ", ".join(swot.get("opportunities", ["Upcoming metro connectivity", "High rental demand"])))
                    st.error("**Threats:** " + ", ".join(swot.get("threats", ["New supply additions in adjacent micro-markets"])))

            except Exception as e:
                st.error(f"Error during valuation: {e}")

# -------------------------------------------------------------
# Module 6: Daily Site Assistant (Activity 5.2)
# -------------------------------------------------------------
elif nav_selection == "📋 Daily Site Assistant":
    st.markdown('<div class="main-header">Daily Construction Site Assistant</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Generate daily operational task breakdowns, labor allocations, equipment readiness, and safety directives.</div>', unsafe_allow_html=True)

    d1, d2 = st.columns(2)
    with d1:
        act_plan = st.text_input("Today's Planned Activity", "RCC Level 2 Slab Casting & Pre-Pour Inspection")
        crew_size = st.number_input("Total Workers / Crew Size", min_value=1, value=25)
    with d2:
        site_cond = st.text_input("Ground & Site Conditions", "Dry weather, formwork propping verified, crane operational")
        shift_hrs = st.number_input("Shift Duration (Hours)", min_value=4, max_value=16, value=8)

    if st.button("Generate Daily Action Plan", type="primary"):
        with st.spinner("Generating task breakdown and site logistics plan..."):
            try:
                res = analyze_daily_site_assistant(
                    planned_activity=act_plan,
                    labour_count=crew_size,
                    site_conditions=site_cond,
                    shift_hours=shift_hrs
                )

                st.subheader(f"Directives: {res.get('summary_directive', 'Execute with zero safety tolerance')}")

                st.markdown("#### ⏱️ Hourly Task Breakdown")
                for task in res.get("daily_task_breakdown", []):
                    st.write(f"• **{task.get('time_window', '')}** — *{task.get('task_title', '')}* (Labor: {task.get('allocated_labor', 0)} workers) | {task.get('instructions', '')}")

                st.markdown("#### 🛠️ Required Materials & Equipment")
                for eq in res.get("required_materials_equipment", []):
                    st.info(f"• **{eq.get('item', '')}**: {eq.get('quantity', '')} — *Inspection: {eq.get('readiness_check', 'Verified')}*")

                st.markdown("#### 🦺 Mandatory Safety Checks & Risk Alerts")
                for s in res.get("safety_precautions_checks", []):
                    st.success(f"✔ {s}")
                for r in res.get("potential_risk_alerts", []):
                    st.error(f"⚠️ {r}")

            except Exception as e:
                st.error(f"Error generating daily plan: {e}")

# -------------------------------------------------------------
# Module 7: Weather-Aware Advisory (Activity 5.3)
# -------------------------------------------------------------
elif nav_selection == "⛅ Weather-Aware Advisory":
    st.markdown('<div class="main-header">Weather-Aware Construction Activity Advisory</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Evaluate activity safety risks against real-time micro-climate factors without fabricated forecast data.</div>', unsafe_allow_html=True)

    w1, w2, w3, w4 = st.columns(4)
    with w1:
        temp = st.slider("Temperature (°C)", min_value=-10.0, max_value=50.0, value=31.0, step=0.5)
    with w2:
        humidity = st.slider("Humidity (%)", min_value=10.0, max_value=100.0, value=65.0, step=1.0)
    with w3:
        rain_prob = st.slider("Rain Probability (%)", min_value=0.0, max_value=100.0, value=25.0, step=5.0)
    with w4:
        wind_spd = st.slider("Wind Speed (km/h)", min_value=0.0, max_value=100.0, value=18.0, step=1.0)

    site_loc = st.text_input("Site Location Tag", "Metro Zone Station 4")
    activities_to_check = st.multiselect(
        "Scheduled Activities to Assess",
        [
            "Concrete Pouring - Level 3 Slab",
            "Tower Crane Hoisting Precast Panels",
            "Deep Trench Foundation Excavation",
            "Exterior Waterproofing & Facade Sealing",
            "Roof Scaffolding Installation",
            "High Altitude Structural Steel Welding"
        ],
        default=[
            "Concrete Pouring - Level 3 Slab",
            "Tower Crane Hoisting Precast Panels",
            "Deep Trench Foundation Excavation"
        ]
    )

    if st.button("Evaluate Weather Safety Feasibility", type="primary"):
        with st.spinner("Evaluating weather risks against IS & OSHA thresholds..."):
            try:
                res = analyze_weather_advisor(
                    location_name=site_loc,
                    temp_c=temp,
                    humidity_pct=humidity,
                    rain_prob_pct=rain_prob,
                    wind_kmh=wind_spd,
                    planned_activities=activities_to_check
                )

                readiness = res.get("site_readiness_score", 90)
                rec = res.get("overall_recommendation", "GO")

                st.subheader("Site Readiness Assessment")
                sc1, sc2 = st.columns([1, 3])
                sc1.metric("Site Readiness Score", f"{readiness}/100")
                
                badge_class = "badge-go" if rec == "GO" else ("badge-caution" if rec == "CAUTION" else "badge-nogo")
                sc2.markdown(f"**Overall Recommendation:** <span class='{badge_class}'>{rec}</span>", unsafe_allow_html=True)

                st.markdown("#### 📋 Activity-Level Decisions")
                for item in res.get("activity_decisions", []):
                    dec = item.get("decision", "GO")
                    b_cls = "badge-go" if dec == "GO" else ("badge-caution" if dec == "CAUTION" else "badge-nogo")
                    
                    with st.expander(f"{item.get('activity')} — [{dec}]", expanded=True):
                        st.markdown(f"**Status:** <span class='{b_cls}'>{dec}</span> | **Risk Level:** {item.get('risk_level', 'Low')}", unsafe_allow_html=True)
                        st.write(f"**Weather Factor:** {item.get('primary_weather_factor', '')}")
                        st.write(f"**Mitigation:** {item.get('mitigation_recommendations', '')}")
                        if item.get("hazard_precautions"):
                            st.write("**Precautions:**")
                            for p in item.get("hazard_precautions"):
                                st.write(f"  - {p}")

                st.caption(f"ℹ️ {res.get('data_source_note', '')}")
            except Exception as e:
                st.error(f"Error during weather advisory analysis: {e}")

# -------------------------------------------------------------
# Module 8: Construction Chatbot (Activity 5.1)
# -------------------------------------------------------------
elif nav_selection == "💬 Construction Chatbot (IS/OSHA)":
    st.markdown('<div class="main-header">Civil Engineering & Code Standards Chatbot</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Ask technical questions governed by IS 456:2000, IS 1893, NBC 2016, ACI 318, and OSHA 1926.</div>', unsafe_allow_html=True)

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = [
            {"role": "assistant", "content": "Hello! I am your Senior Civil Engineering and Building Code Assistant. You can ask me questions about concrete mix designs, curing rules, structural crack criteria, or OSHA fall protection regulations."}
        ]

    c_domain = st.selectbox("Engineering Domain", ["General Construction", "Structural Engineering", "Concrete Technology", "Site Safety & OSHA", "Building Codes & IS Standards"])

    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    user_query = st.chat_input("Ask a construction or engineering question...")
    if user_query:
        st.session_state.chat_history.append({"role": "user", "content": user_query})
        with st.chat_message("user"):
            st.markdown(user_query)

        with st.chat_message("assistant"):
            with st.spinner("Consulting civil engineering standards and technical codes..."):
                try:
                    res = query_chatbot(query=user_query, domain=c_domain)
                    reply = res.get("response", "Could not generate response.")
                    st.markdown(reply)

                    standards = res.get("relevant_standards", [])
                    if standards:
                        st.caption(f"Governing Standards: {', '.join(standards)}")

                    suggestions = res.get("actionable_suggestions", [])
                    if suggestions:
                        with st.expander("Actionable Recommendations"):
                            for sug in suggestions:
                                st.write(f"✔ {sug}")

                    st.session_state.chat_history.append({"role": "assistant", "content": reply})
                except Exception as e:
                    st.error(f"Chatbot query error: {e}")
