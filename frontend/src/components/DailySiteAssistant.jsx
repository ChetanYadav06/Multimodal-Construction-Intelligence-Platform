import React, { useState } from 'react';
import { 
  ClipboardList, 
  Users, 
  HardHat, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  Clock, 
  FileText,
  MapPin
} from 'lucide-react';
import { analyzeDailySiteAssistant } from '../api';

export default function DailySiteAssistant() {
  const [plannedActivity, setPlannedActivity] = useState('Level 2 Slab Concrete Pouring');
  const [labourCount, setLabourCount] = useState(24);
  const [siteConditions, setSiteConditions] = useState('Dry weather, slab staging shuttering inspected, rebar cover cleared');
  const [locationName, setLocationName] = useState('Sector 4B Superstructure');
  const [shiftHours, setShiftHours] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const loadDemo = () => {
    setPlannedActivity('Level 2 Slab Concrete Pouring (M25 Pumped Mix)');
    setLabourCount(28);
    setSiteConditions('Clear sky, pump line primed, formwork leveling completed, rebar inspection sign-off obtained');
    setLocationName('Block B Deck Slab');
    setShiftHours(8);
    setError('');
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        planned_activity: plannedActivity.trim() || 'General Construction Work',
        labour_count: parseInt(labourCount) > 0 ? parseInt(labourCount) : 10,
        site_conditions: siteConditions.trim() || 'Normal conditions',
        location_name: locationName.trim() || 'Main Site',
        shift_hours: parseInt(shiftHours) || 8
      };

      const data = await analyzeDailySiteAssistant(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to generate daily site assistant directives.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-amber-400" />
            Daily Site Assistant & Shift Operations Planner
          </h2>
          <p className="text-sm text-slate-400">
            Automates daily task breakdowns, trade labor allocation, tool & equipment staging, mandatory safety checks, and risk mitigation alerts.
          </p>
        </div>
        <button
          onClick={loadDemo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-semibold transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Concrete Pour Demo
        </button>
      </div>

      {/* Grid: Form vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HardHat className="w-4 h-4 text-amber-400" />
              Shift Parameters
            </h3>

            {/* Planned Activity */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Planned Construction Activity
              </label>
              <input
                type="text"
                value={plannedActivity}
                onChange={(e) => setPlannedActivity(e.target.value)}
                placeholder="e.g. Slab Concrete Pouring / Deep Trench Excavation"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Labour Count & Shift Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Labour Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={labourCount}
                  onChange={(e) => setLabourCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Shift (Hours)
                </label>
                <input
                  type="number"
                  min="4"
                  max="16"
                  value={shiftHours}
                  onChange={(e) => setShiftHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Site Conditions */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Site & Substrate Conditions
              </label>
              <textarea
                rows={3}
                value={siteConditions}
                onChange={(e) => setSiteConditions(e.target.value)}
                placeholder="Describe ground firmness, scaffolding status, material staging, access routes..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Work Zone / Location Tag
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Daily Operations Plan...
                </>
              ) : (
                <>
                  <ClipboardList className="w-4 h-4" />
                  Generate Daily Plan & Directives
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Presentation (8 cols) */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Summary Directive Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Supervisor Daily Action Directive
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {result.labour_count} Workforce Personnel Allocated
                  </span>
                </div>
                <p className="text-base font-bold text-white leading-relaxed">
                  {result.summary_directive}
                </p>
                <div className="text-xs text-slate-400 pt-1">
                  Conditions: <span className="text-slate-200">{result.site_conditions}</span>
                </div>
              </div>

              {/* Task Breakdown Table */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Chronological Shift Task Breakdown
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">Shift Workflows</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Sequential Task</th>
                        <th className="py-2.5 px-4 font-semibold">Trade</th>
                        <th className="py-2.5 px-4 font-semibold">Duration</th>
                        <th className="py-2.5 px-4 font-semibold">Workforce</th>
                        <th className="py-2.5 px-4 font-semibold">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {result.daily_task_breakdown?.map((task, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-sans font-medium text-slate-200">
                            {task.task_name}
                          </td>
                          <td className="py-2.5 px-4 font-sans text-slate-400">
                            {task.trade}
                          </td>
                          <td className="py-2.5 px-4 text-slate-300">
                            {task.duration_hours} hrs
                          </td>
                          <td className="py-2.5 px-4 text-amber-400 font-bold">
                            {task.allocated_workers} workers
                          </td>
                          <td className="py-2.5 px-4 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              task.priority === 'Critical' || task.priority === 'Mandatory'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Equipment and Materials Needed */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  Mandatory Staged Materials & Machinery Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.required_materials_equipment?.map((eq, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs"
                    >
                      <span className="font-bold text-slate-200 block">{eq.item}</span>
                      <span className="text-slate-400 block text-[11px]">{eq.requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Precautions & Risk Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Pre-Start Safety Inspection Checks
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.safety_precautions_checks?.map((check, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Potential Operational Risk Alerts
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.potential_risk_alerts?.map((risk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <ClipboardList className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-400 mb-1">Awaiting Daily Activity Parameters</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Specify planned activity, labour count, and ground conditions or load our demo to generate task sequencing and equipment requirements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

