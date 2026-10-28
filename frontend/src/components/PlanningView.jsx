import React, { useState } from 'react';
import { 
  CalendarRange, 
  DollarSign, 
  Sparkles, 
  Loader2, 
  Package, 
  Clock, 
  Users, 
  AlertCircle, 
  TrendingUp,
  Layers,
  ChevronRight
} from 'lucide-react';
import { generateProjectPlan } from '../api';

export default function PlanningView({ demoSamples, onPlanSaved }) {
  const [projectName, setProjectName] = useState('Skyline Heights Commercial Center');
  const [buildingType, setBuildingType] = useState('Commercial Office G+4');
  const [totalArea, setTotalArea] = useState(8500);
  const [targetDuration, setTargetDuration] = useState(14);
  const [finishGrade, setFinishGrade] = useState('Premium');
  const [laborTier, setLaborTier] = useState('Standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const loadDemo = () => {
    if (demoSamples?.planning) {
      setProjectName(demoSamples.planning.project_name);
      setBuildingType(demoSamples.planning.building_type);
      setTotalArea(demoSamples.planning.total_area_sqft);
      setTargetDuration(demoSamples.planning.target_duration_months);
      setFinishGrade(demoSamples.planning.finish_grade);
      setLaborTier(demoSamples.planning.labor_rate_tier);
      setError('');
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        project_name: projectName,
        building_type: buildingType,
        total_area_sqft: parseFloat(totalArea) || 1000,
        target_duration_months: parseInt(targetDuration) || 6,
        finish_grade: finishGrade,
        labor_rate_tier: laborTier
      };

      const data = await generateProjectPlan(payload);
      setResult(data);
      if (onPlanSaved) onPlanSaved();
    } catch (err) {
      setError(err.message || 'Plan generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const formatCost = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarRange className="w-7 h-7 text-sky-400" />
            Construction Project Planning & Material Estimation
          </h2>
          <p className="text-sm text-slate-400">
            Automated civil engineering quantity takeoffs (BOM), cost breakdowns, milestone Gantt schedules, and workforce planning.
          </p>
        </div>
        <button
          onClick={loadDemo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Commercial Complex Demo
        </button>
      </div>

      {/* Grid: Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Project Parameters
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Building Typology
              </label>
              <select
                value={buildingType}
                onChange={(e) => setBuildingType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
              >
                <option value="Residential G+2">Residential G+2 Villa</option>
                <option value="Commercial Office G+4">Commercial Office G+4</option>
                <option value="Industrial Shed">Industrial Warehouse / PEB Shed</option>
                <option value="High-Rise Tower G+14">High-Rise Residential G+14</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Built-up Area (Sq.Ft)
                </label>
                <input
                  type="number"
                  min="500"
                  max="1000000"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500 font-mono"
                />
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

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
                  Labor Market Tier
                </label>
                <select
                  value={laborTier}
                  onChange={(e) => setLaborTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Metro High">Metro High (+35%)</option>
                </select>
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
                  Generating BOM & Milestones...
                </>
              ) : (
                <>
                  <CalendarRange className="w-4 h-4" />
                  Generate Project Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Presentation (8 cols) */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Cost Summary Cards */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/30 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Total Estimated Construction Budget
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {result.total_area_sqft.toLocaleString()} sq.ft • {result.target_duration_months} Months Schedule
                  </span>
                </div>

                <div className="text-4xl font-extrabold text-white font-mono">
                  {formatCost(result.cost_breakdown.total_estimated_budget)}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Materials</span>
                    <span className="text-xs font-bold text-slate-200 font-mono mt-0.5 block">
                      {formatCost(result.cost_breakdown.material_cost)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Labor</span>
                    <span className="text-xs font-bold text-slate-200 font-mono mt-0.5 block">
                      {formatCost(result.cost_breakdown.labor_cost)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Plant & Machinery</span>
                    <span className="text-xs font-bold text-slate-200 font-mono mt-0.5 block">
                      {formatCost(result.cost_breakdown.equipment_machinery_cost)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Contingency (7%)</span>
                    <span className="text-xs font-bold text-amber-400 font-mono mt-0.5 block">
                      {formatCost(result.cost_breakdown.contingency_cost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill of Materials (BOM) Takeoff Table */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Package className="w-4 h-4 text-sky-400" />
                    Bill of Materials (BOM) Quantity Takeoff
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">IS 1200 / ACI Benchmark</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Material Specification</th>
                        <th className="py-2.5 px-4 font-semibold">Category</th>
                        <th className="py-2.5 px-4 font-semibold">Est. Quantity</th>
                        <th className="py-2.5 px-4 font-semibold">Unit Rate</th>
                        <th className="py-2.5 px-4 font-semibold">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {result.bill_of_materials?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-sans font-medium text-slate-200">
                            {item.item}
                            <span className="block text-[10px] text-slate-500 font-mono">
                              {item.benchmark_ratio}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            {item.quantity.toLocaleString()} {item.unit}
                          </td>
                          <td className="py-2.5 px-4 text-slate-400">${item.unit_rate}</td>
                          <td className="py-2.5 px-4 text-sky-400 font-bold font-mono">
                            {formatCost(item.total_cost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Milestone Schedule & Critical Path */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    Milestone Schedule & Critical Path Method (CPM)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                    Red = Critical Path
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

              {/* Workforce & Manpower allocation */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  Trade Manpower & Peak Labor Allocation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.trade_manpower?.map((trade, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-300">{trade.trade}</span>
                      <div className="text-right font-mono">
                        <span className="text-sky-400 font-bold block">{trade.peak_workers} Peak</span>
                        <span className="text-[10px] text-slate-500">{trade.total_man_days} Man-Days</span>
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
                Configure your building dimensions or load our commercial project demo to compute bill of materials and CPM schedule.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

