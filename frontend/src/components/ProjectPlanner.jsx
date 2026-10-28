import React, { useState } from 'react';
import { 
  CalendarRange, 
  Sparkles, 
  Loader2, 
  Package, 
  Clock, 
  Users, 
  MapPin, 
  Maximize2, 
  Building2, 
  Layers, 
  CheckCircle2, 
  FileText,
  Compass
} from 'lucide-react';
import { generateProjectPlan } from '../api';

export default function ProjectPlanner({ demoSamples, onPlanSaved }) {
  const [projectName, setProjectName] = useState('Surya Duplex Villa');
  const [projectDescription, setProjectDescription] = useState('G+1 contemporary residential villa with natural lighting and terrace garden');
  const [plotLength, setPlotLength] = useState(50);
  const [plotWidth, setPlotWidth] = useState(30);
  const [constructionType, setConstructionType] = useState('Residential');
  const [cityLocation, setCityLocation] = useState('Bengaluru');
  const [finishGrade, setFinishGrade] = useState('Standard');
  const [targetDuration, setTargetDuration] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const plotArea = plotLength * plotWidth;

  const loadDemo = () => {
    setProjectName('Surya Duplex Villa');
    setProjectDescription('Independent 3BHK modern duplex villa with covered parking, utility, and open terrace');
    setPlotLength(50);
    setPlotWidth(30);
    setConstructionType('Residential');
    setCityLocation('Bengaluru');
    setFinishGrade('Premium');
    setTargetDuration(12);
    setError('');
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        project_name: projectName,
        project_description: projectDescription,
        plot_length_ft: parseFloat(plotLength) || 50,
        plot_width_ft: parseFloat(plotWidth) || 30,
        plot_dimensions: `${plotWidth} ft x ${plotLength} ft`,
        construction_type: constructionType,
        building_type: `${constructionType} G+1`,
        city_location: cityLocation,
        total_area_sqft: plotArea * 1.5, // G+1 built-up factor
        target_duration_months: parseInt(targetDuration) || 12,
        finish_grade: finishGrade,
        currency: 'INR'
      };

      const data = await generateProjectPlan(payload);
      setResult(data);
      if (onPlanSaved) onPlanSaved();
    } catch (err) {
      setError(err.message || 'Failed to generate project plan.');
    } finally {
      setLoading(false);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarRange className="w-7 h-7 text-sky-400" />
            Construction Project Planner & Estimation Engine
          </h2>
          <p className="text-sm text-slate-400">
            Intelligent planning for material takeoffs (Cement, Sand, Aggregate, Steel), cost estimates in Indian Rupees (₹), CPM milestones, and conceptual architectural visualization.
          </p>
        </div>
        <button
          onClick={loadDemo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 text-xs font-semibold transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Bengaluru Villa Demo
        </button>
      </div>

      {/* Main Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-400" />
              Project & Plot Specifications
            </h3>

            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Surya Duplex Villa"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Project Description & Scope
              </label>
              <textarea
                rows={2}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe project details, layout requirements, aesthetic style..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            {/* Plot Dimensions */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
                <span>Plot Dimensions (Feet)</span>
                <span className="text-sky-400 font-mono text-[11px]">Area: {plotArea.toLocaleString()} sq.ft</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(e.target.value)}
                    placeholder="Width (ft)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">Width / Frontage</span>
                </div>
                <div>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={plotLength}
                    onChange={(e) => setPlotLength(e.target.value)}
                    placeholder="Length (ft)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-sky-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">Length / Depth</span>
                </div>
              </div>
            </div>

            {/* Construction Type & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Construction Type
                </label>
                <select
                  value={constructionType}
                  onChange={(e) => setConstructionType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="Residential">Residential Villa</option>
                  <option value="Apartment Building">Apartment Building</option>
                  <option value="Commercial">Commercial Office</option>
                  <option value="Industrial">Industrial Warehouse</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  City / Location
                </label>
                <select
                  value={cityLocation}
                  onChange={(e) => setCityLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Tier 2 City">Tier 2 City</option>
                </select>
              </div>
            </div>

            {/* Finish Grade & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Finish Grade
                </label>
                <select
                  value={finishGrade}
                  onChange={(e) => setFinishGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="Economy">Economy</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  min="3"
                  max="48"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Computing BOM & Visualization...
                </>
              ) : (
                <>
                  <CalendarRange className="w-4 h-4" />
                  Generate Construction Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Column (8 cols) */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Cost Summary Banner (in INR ₹) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/30 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Total Estimated Construction Cost (INR)
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {result.city_location} • {result.plot_dimensions} ({Math.round(result.total_area_sqft || 0).toLocaleString()} sq.ft Built-up)
                  </span>
                </div>

                <div className="text-4xl font-extrabold text-white font-mono">
                  {formatINR(result.cost_breakdown?.total_estimated_budget)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Materials</span>
                    <span className="text-xs font-bold text-slate-200 font-mono mt-0.5 block">
                      {formatINR(result.cost_breakdown?.material_cost)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Labor & Trades</span>
                    <span className="text-xs font-bold text-slate-200 font-mono mt-0.5 block">
                      {formatINR(result.cost_breakdown?.labor_cost)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Machinery / Plant</span>
                    <span className="text-xs font-bold text-slate-200 font-mono mt-0.5 block">
                      {formatINR(result.cost_breakdown?.equipment_machinery_cost)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Contingency Reserve</span>
                    <span className="text-xs font-bold text-amber-400 font-mono mt-0.5 block">
                      {formatINR(result.cost_breakdown?.contingency_cost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Material Estimates Cards (Cement, Sand, Aggregate, Steel) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-sky-400" />
                  Primary Structural Materials Takeoff (IS Standards)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Cement */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block font-semibold">Cement (PPC 53)</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {result.core_materials_summary?.cement?.quantity?.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {result.core_materials_summary?.cement?.unit}
                    </span>
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs font-bold text-sky-400 font-mono">
                      {formatINR(result.core_materials_summary?.cement?.total_cost_inr)}
                    </div>
                  </div>

                  {/* Sand */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block font-semibold">Sand (Fine Aggr.)</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {result.core_materials_summary?.sand?.quantity?.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {result.core_materials_summary?.sand?.unit}
                    </span>
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs font-bold text-sky-400 font-mono">
                      {formatINR(result.core_materials_summary?.sand?.total_cost_inr)}
                    </div>
                  </div>

                  {/* Aggregate */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block font-semibold">Coarse Aggregate</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {result.core_materials_summary?.aggregate?.quantity?.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {result.core_materials_summary?.aggregate?.unit}
                    </span>
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs font-bold text-sky-400 font-mono">
                      {formatINR(result.core_materials_summary?.aggregate?.total_cost_inr)}
                    </div>
                  </div>

                  {/* Steel */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-xs text-slate-400 block font-semibold">Steel (Fe550D TMT)</span>
                    <span className="text-lg font-bold text-white font-mono mt-1 block">
                      {result.core_materials_summary?.steel?.quantity}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {result.core_materials_summary?.steel?.unit}
                    </span>
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs font-bold text-sky-400 font-mono">
                      {formatINR(result.core_materials_summary?.steel?.total_cost_inr)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conceptual Architectural Visualization Preview (Activity 3.1) */}
              {result.architectural_preview && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      AI Conceptual Architectural Visualization & Spatial Layout
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {result.architectural_preview.orientation}
                    </span>
                  </div>

                  {/* SVG Blueprint Renderer */}
                  <div
                    className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-2"
                    dangerouslySetInnerHTML={{ __html: result.architectural_preview.visualization_svg }}
                  />

                  {/* Spatial Zones Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {result.architectural_preview.spatial_zones?.map((zone, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{zone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Phase-wise Construction Schedule */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    Phase-Wise Construction Schedule & CPM Milestones
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                    Critical Path Highlighted
                  </span>
                </div>

                <div className="space-y-3">
                  {result.schedule_milestones?.map((phase, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                        phase.critical_path
                          ? 'bg-slate-950 border-rose-500/40'
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
                          {phase.critical_path && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          )}
                          {phase.phase_name}
                        </span>
                        <span className="font-mono text-slate-400">
                          Week {phase.start_week} — Week {phase.end_week} ({phase.duration_weeks} Weeks)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {phase.key_deliverables?.map((d, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                          >
                            ✓ {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <CalendarRange className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-400 mb-1">Awaiting Project Specifications</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Input your plot dimensions, city location, and construction scope or click 'Load Bengaluru Villa Demo' to generate complete estimates and conceptual blueprint.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
