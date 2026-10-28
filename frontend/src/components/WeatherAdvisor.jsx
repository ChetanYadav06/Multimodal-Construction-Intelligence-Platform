import React, { useState } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Loader2, 
  Info, 
  ShieldAlert,
  ArrowRight,
  Plus,
  Trash2
} from 'lucide-react';
import { getWeatherAdvisor } from '../api';

export default function WeatherAdvisor() {
  const [locationName, setLocationName] = useState('Sector 4B Site');
  const [temperature, setTemperature] = useState(32.0);
  const [humidity, setHumidity] = useState(70.0);
  const [rainProb, setRainProb] = useState(65.0);
  const [windSpeed, setWindSpeed] = useState(36.0);
  const [plannedActivities, setPlannedActivities] = useState([
    'Concrete Pouring - Level 2 Deck Slab',
    'Tower Crane Hoisting Heavy Steel Girders',
    'Deep Foundation Trench Bench Excavation',
    'Exterior Facade Waterproofing Membrane'
  ]);
  const [newActivity, setNewActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const simulateStorm = () => {
    setTemperature(26.0);
    setHumidity(88.0);
    setRainProb(85.0);
    setWindSpeed(45.0);
    setError('');
  };

  const simulateClear = () => {
    setTemperature(25.0);
    setHumidity(45.0);
    setRainProb(5.0);
    setWindSpeed(12.0);
    setError('');
  };

  const addActivity = () => {
    if (newActivity.trim()) {
      setPlannedActivities([...plannedActivities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const removeActivity = (idx) => {
    setPlannedActivities(plannedActivities.filter((_, i) => i !== idx));
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        location_name: locationName.trim() || 'Site Alpha',
        temperature_c: parseFloat(temperature) || 25.0,
        humidity_pct: parseFloat(humidity) || 50.0,
        rain_probability_pct: parseFloat(rainProb) || 10.0,
        wind_speed_kmh: parseFloat(windSpeed) || 15.0,
        planned_activities: plannedActivities.length > 0 ? plannedActivities : ['Concrete Pouring']
      };

      const data = await getWeatherAdvisor(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to process weather advisory.');
    } finally {
      setLoading(false);
    }
  };

  const getDecisionBadge = (decision) => {
    if (decision === 'GO') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> GO - SAFE
        </span>
      );
    }
    if (decision === 'CAUTION') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" /> CAUTION REQUIRED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
        <XCircle className="w-3.5 h-3.5" /> NO-GO / HALT
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CloudSun className="w-7 h-7 text-cyan-400" />
            Weather-Aware Construction Risk Advisor
          </h2>
          <p className="text-sm text-slate-400">
            Activity-specific GO / CAUTION / NO-GO recommendations evaluating wind velocity, rain washouts, thermal cracking, and trench stability.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={simulateClear}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/25 transition-all"
          >
            Clear Weather Preset
          </button>
          <button
            onClick={simulateStorm}
            className="px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/25 transition-all"
          >
            High Wind & Storm Preset
          </button>
        </div>
      </div>

      {/* Grid: Inputs vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-cyan-400" />
              Site Meteorological Conditions
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Site Location Identifier
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Weather Metric Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  Temp (°C)
                </label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  Wind (km/h)
                </label>
                <input
                  type="number"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  Humidity (%)
                </label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                  <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                  Rain Prob (%)
                </label>
                <input
                  type="number"
                  value={rainProb}
                  onChange={(e) => setRainProb(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Activities List */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Scheduled Construction Activities
              </label>
              <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto">
                {plannedActivities.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between"
                  >
                    <span className="truncate">{act}</span>
                    <button
                      onClick={() => removeActivity(idx)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addActivity();
                  }}
                  placeholder="Add planned trade/task..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={addActivity}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Assessing Meteorological Hazards...
                </>
              ) : (
                <>
                  <CloudSun className="w-4 h-4" />
                  Evaluate GO / NO-GO Decisions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Presentation (8 cols) */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Overall Recommendation Banner */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                result.overall_recommendation === 'GO' ? 'bg-emerald-950/30 border-emerald-500/30' :
                result.overall_recommendation === 'CAUTION' ? 'bg-amber-950/30 border-amber-500/30' :
                'bg-rose-950/40 border-rose-500/40'
              }`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block text-slate-400">
                    Overall Site Operations Recommendation
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-3xl font-extrabold ${
                      result.overall_recommendation === 'GO' ? 'text-emerald-400' :
                      result.overall_recommendation === 'CAUTION' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {result.overall_recommendation}
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      • {result.weather_condition} ({result.temperature_c}°C, Wind {result.wind_speed_kmh} km/h)
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold uppercase block text-slate-400">Readiness Score</span>
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {result.site_readiness_score}/100
                  </span>
                </div>
              </div>

              {/* Activity Decisions Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  Activity-by-Activity Suitability & Safety Directives
                </h3>

                <div className="space-y-3">
                  {result.activity_decisions?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-200 text-sm">{item.activity}</span>
                        {getDecisionBadge(item.decision)}
                      </div>

                      <div className="text-xs font-medium text-amber-400/90">
                        Factor: {item.primary_weather_factor}
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                        <span className="font-bold text-cyan-400 block">Mitigation Directive:</span>
                        <p className="text-slate-300 leading-relaxed">{item.mitigation_recommendations}</p>
                      </div>

                      {item.hazard_precautions?.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[11px] font-bold text-slate-400 block mb-1">Safety Precautions:</span>
                          <ul className="space-y-1">
                            {item.hazard_precautions.map((p, i) => (
                              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                                <span className="text-cyan-400">•</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* General Site Precautions & Mitigations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    General Weather Precautions
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.hazard_precautions?.map((prec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{prec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Strategic Shift Adjustments
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.mitigation_recommendations?.map((mit, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{mit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Data Source Notice */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{result.data_source_note}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <CloudSun className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-400 mb-1">Awaiting Weather Inputs</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Input your observed site weather conditions or click a preset above to compute GO / NO-GO construction advisories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

