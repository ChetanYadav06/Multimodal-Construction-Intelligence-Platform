import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  FileText, 
  Sparkles, 
  Loader2, 
  MapPin, 
  RefreshCw,
  Printer
} from 'lucide-react';
import { analyzeSafety } from '../api';

export default function SafetyView({ demoSamples, onInspectionSaved }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [locationTag, setLocationTag] = useState('Sector 4B Elevation Deck');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const loadDemo = () => {
    if (demoSamples?.safety) {
      setPreviewUrl(demoSamples.safety.image_url);
      setNotes(demoSamples.safety.notes);
      setLocationTag(demoSamples.safety.location_tag);
      setSelectedFile(null); // Backend will analyze using demo reference or default
      setError('');
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('notes', notes);
      formData.append('location_tag', locationTag);

      const data = await analyzeSafety(formData);
      setResult(data);
      if (onInspectionSaved) onInspectionSaved();
    } catch (err) {
      setError(err.message || 'Safety analysis failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getStatusBadge = (status) => {
    if (status === 'Compliant') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3 h-3" /> Compliant
        </span>
      );
    }
    if (status === 'Non-Compliant') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3 h-3" /> Violation
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
        <HelpCircle className="w-3 h-3" /> N/A
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-400" />
            Construction Site Safety Monitoring
          </h2>
          <p className="text-sm text-slate-400">
            Automated computer vision surveillance assessing worker PPE compliance and OSHA 1926 hazard violations.
          </p>
        </div>
        <button
          onClick={loadDemo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Demo Site Image & Notes
        </button>
      </div>

      {/* Main Grid: Upload & Controls / Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Image Uploader */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Site Image Upload / Camera Frame
            </label>

            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-video bg-slate-950 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Site preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 text-rose-400 text-xs font-semibold hover:bg-slate-900 border border-slate-700"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-8 cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-colors">
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-slate-300">Click to upload site photo</span>
                <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP (Max 10MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Location Tag */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Location / Sector Tag
              </label>
              <input
                type="text"
                value={locationTag}
                onChange={(e) => setLocationTag(e.target.value)}
                placeholder="e.g. Sector 4B Elevation Deck"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Inspector Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Inspector Field Notes / Focus Areas
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe current activities, e.g. scaffolding work, crane lifting, or unbarricaded edges..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Site Safety & PPE...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Run AI Safety Inspection
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Results (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Score & Status Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`rounded-xl border p-4 text-center ${getScoreColor(result.safety_score)}`}>
                  <span className="text-xs font-semibold uppercase tracking-wider block">Safety Score</span>
                  <span className="text-3xl font-extrabold">{result.safety_score}</span>
                  <span className="text-xs block mt-1">out of 100 benchmark</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Risk Level</span>
                  <span className={`text-2xl font-bold mt-1 inline-block ${
                    result.risk_level === 'Low' ? 'text-emerald-400' :
                    result.risk_level === 'Medium' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {result.risk_level}
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">Hazard Exposure</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">OSHA Status</span>
                  <span className={`text-2xl font-bold mt-1 inline-block ${
                    result.compliance_status === 'Compliant' ? 'text-emerald-400' :
                    result.compliance_status === 'Warning' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {result.compliance_status}
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">Subpart Compliance</span>
                </div>
              </div>

              {/* PPE Compliance Checklist Table */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    PPE Compliance Verification Matrix
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">OSHA 1926.95</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Equipment Type</th>
                        <th className="py-2.5 px-4 font-semibold">Status</th>
                        <th className="py-2.5 px-4 font-semibold">Detected</th>
                        <th className="py-2.5 px-4 font-semibold">Missing</th>
                        <th className="py-2.5 px-4 font-semibold">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {result.ppe_compliance?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-medium text-slate-200">{item.item}</td>
                          <td className="py-2.5 px-4">{getStatusBadge(item.status)}</td>
                          <td className="py-2.5 px-4 text-emerald-400 font-mono">{item.detected_count}</td>
                          <td className="py-2.5 px-4 text-rose-400 font-mono">{item.missing_count}</td>
                          <td className="py-2.5 px-4 text-slate-400 font-mono">
                            {Math.round((item.confidence || 0.95) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Identified Hazards */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Identified Site Hazards & Violations
                </h3>
                {result.hazards_identified?.map((hazard, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 text-sm">{hazard.hazard}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        hazard.severity === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        hazard.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}>
                        {hazard.severity} Severity
                      </span>
                    </div>
                    <div className="text-xs text-amber-400/90 font-mono">
                      {hazard.osha_standard} • <span className="text-slate-400">{hazard.location_in_frame}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-amber-400 block mb-0.5">Mandatory Action:</span>
                      {hazard.immediate_action}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations & Summary */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Supervisor Summary & Corrective Action Plan
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {result.overall_summary}
                </p>
                <ul className="space-y-1.5 pt-2">
                  {result.recommended_actions?.map((act, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <ShieldCheck className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-400 mb-1">Awaiting Inspection Input</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Upload a construction site photograph or load our sample image to run automated safety evaluation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

