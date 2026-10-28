import React, { useState } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sparkles, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Copy, 
  Check,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { getDailySiteAdvisory } from '../api';

export default function DailySiteView({ demoSamples, onReportSaved }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState('Harbor Terminal Expansion Zone B');
  const [temperature, setTemperature] = useState(31.5);
  const [humidity, setHumidity] = useState(72);
  const [rainProb, setRainProb] = useState(65);
  const [windSpeed, setWindSpeed] = useState(34);
  const [scheduledActivities, setScheduledActivities] = useState([
    'Concrete Pouring - Level 4 Transfer Slab',
    'Tower Crane Hoisting Heavy Steel Trusses',
    'Perimeter Sheet Pile Trench Excavation',
    'Exterior Sealant Application on Curtain Wall'
  ]);
  const [totalWorkers, setTotalWorkers] = useState(48);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const simulateStorm = () => {
    setTemperature(26.0);
    setHumidity(88);
    setRainProb(85);
    setWindSpeed(45);
    setError('');
  };

  const simulateClear = () => {
    setTemperature(24.5);
    setHumidity(45);
    setRainProb(5);
    setWindSpeed(12);
    setError('');
  };

  const handleFetchAdvisory = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        date: date,
        location_name: locationName,
        temperature_c: parseFloat(temperature) || 25,
        humidity_pct: parseFloat(humidity) || 50,
        rain_probability_pct: parseFloat(rainProb) || 10,
        wind_speed_kmh: parseFloat(windSpeed) || 15,
        scheduled_activities: scheduledActivities,
        total_workers_on_site: parseInt(totalWorkers) || 30
      };

      const data = await getDailySiteAdvisory(payload);
      setResult(data);
      if (onReportSaved) onReportSaved();
    } catch (err) {
      setError(err.message || 'Daily site advisory failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDSR = () => {
    if (result?.daily_site_report_text) {
      navigator.clipboard.writeText(result.daily_site_report_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'Safe to Proceed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" /> Safe to Proceed
        </span>
      );
    }
    if (status === 'Proceed with Caution') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" /> Caution Required
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold">
        <XCircle className="w-3 h-3" /> RESCHEDULE / HALT
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CloudSun className="w-7 h-7 text-cyan-400" />
            Daily Site Assistance & Weather Risk Advisory
          </h2>
          <p className="text-sm text-slate-400">
            Microclimate risk assessment for concrete pouring, tower crane lifting, and excavation with automated Daily Site Report (DSR) logging.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            Storm & High Wind Preset
          </button>
        </div>
      </div>

      {/* Grid: Inputs vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Weather & Site Conditions
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                Project Site Location
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Weather Gauges Inputs */}
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
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
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Active Workforce on Site (Workers)
              </label>
              <input
                type="number"
                value={totalWorkers}
                onChange={(e) => setTotalWorkers(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <button
              onClick={handleFetchAdvisory}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Evaluating Weather Hazards...
                </>
              ) : (
                <>
                  <CloudSun className="w-4 h-4" />
                  Evaluate Daily Site Safety
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Presentation (8 cols) */}
        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Alert Status Banner */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                result.site_safety_index >= 80 ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' :
                result.site_safety_index >= 50 ? 'bg-amber-950/30 border-amber-500/30 text-amber-400' :
                'bg-rose-950/40 border-rose-500/40 text-rose-400'
              }`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block opacity-80">
                    Overall Operations Alert Status
                  </span>
                  <span className="text-2xl font-extrabold text-white">
                    {result.overall_weather_alert}
                  </span>
                  <p className="text-xs text-slate-300 mt-1">
                    {result.weather_condition} • {result.temperature_c}°C • Wind {result.wind_speed_kmh} km/h • Rain {result.rain_probability_pct}%
                  </p>
                </div>

                <div className="text-center sm:text-right">
                  <span className="text-xs font-bold uppercase block opacity-80">Site Safety Index</span>
                  <span className="text-4xl font-extrabold font-mono text-white">
                    {result.site_safety_index}/100
                  </span>
                </div>
              </div>

              {/* Activity Risk Matrix */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-cyan-400" />
                  Scheduled Trades Risk Matrix
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {result.activity_risk_matrix?.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-200 text-sm">{act.activity}</span>
                        {getStatusBadge(act.status)}
                      </div>

                      <p className="text-xs text-amber-400/90 font-medium">
                        Trigger: {act.primary_weather_factor}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        Operating Window: <span className="text-slate-200">{act.allowed_operating_window}</span>
                      </div>

                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-slate-400 block mb-1">Safety Measures:</span>
                        <ul className="space-y-1">
                          {act.safety_precautions?.map((p, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-cyan-400 mt-0.5">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toolbox Talk Briefing */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Recommended Daily Safety Toolbox Talk Topic
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.recommended_toolbox_talk}
                </p>
              </div>

              {/* Generated Daily Site Report (DSR) */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Formal Daily Site Report (DSR) Document
                  </h4>
                  <button
                    onClick={handleCopyDSR}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Report</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {result.daily_site_report_text}
                </pre>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <CloudSun className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-400 mb-1">Awaiting Site Weather Inputs</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Input your site meteorological conditions or test a preset to evaluate operational activity risks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

