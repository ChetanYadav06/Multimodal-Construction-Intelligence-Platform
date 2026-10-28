import React, { useState } from 'react';
import { 
  SearchCheck, 
  UploadCloud, 
  AlertTriangle, 
  Sparkles, 
  Loader2, 
  Activity, 
  Wrench, 
  CheckCircle2, 
  FileText,
  ShieldAlert
} from 'lucide-react';
import { analyzeCrack } from '../api';

export default function CrackView({ demoSamples, onAnalysisSaved }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [structuralElement, setStructuralElement] = useState('Beam');
  const [material, setMaterial] = useState('Reinforced Concrete');
  const [notes, setNotes] = useState('');
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
    if (demoSamples?.crack) {
      setPreviewUrl(demoSamples.crack.image_url);
      setStructuralElement(demoSamples.crack.structural_element);
      setMaterial(demoSamples.crack.material);
      setNotes(demoSamples.crack.notes);
      setSelectedFile(null);
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
      formData.append('structural_element', structuralElement);
      formData.append('material', material);
      formData.append('notes', notes);

      const data = await analyzeCrack(formData);
      setResult(data);
      if (onAnalysisSaved) onAnalysisSaved();
    } catch (err) {
      setError(err.message || 'Crack analysis failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <SearchCheck className="w-7 h-7 text-rose-400" />
            Structural Crack Detection & Forensic Analysis
          </h2>
          <p className="text-sm text-slate-400">
            Multimodal structural diagnostics identifying crack classification, severity risk, root cause mechanics, and engineering remediation under ACI 224R.
          </p>
        </div>
        <button
          onClick={loadDemo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-400 text-xs font-semibold transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load RC Beam Demo Photo
        </button>
      </div>

      {/* Grid: Inputs vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Structural Element Photograph
            </label>

            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 aspect-video bg-slate-950 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Crack preview"
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
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-rose-500/50 rounded-xl p-8 cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-colors">
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm font-semibold text-slate-300">Upload crack / element image</span>
                <span className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Element and Material Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Structural Element
                </label>
                <select
                  value={structuralElement}
                  onChange={(e) => setStructuralElement(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="Beam">Beam</option>
                  <option value="Column">Column</option>
                  <option value="Slab">Floor / Deck Slab</option>
                  <option value="Shear Wall">Shear Wall</option>
                  <option value="Foundation">Foundation Footing</option>
                  <option value="Retaining Wall">Retaining Wall</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Substrate Material
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="Reinforced Concrete">Reinforced Concrete</option>
                  <option value="Prestressed Concrete">Prestressed Concrete</option>
                  <option value="Masonry Brick">Masonry Brick</option>
                  <option value="AAC Blocks">AAC Blocks</option>
                  <option value="Stone Masonry">Stone Masonry</option>
                </select>
              </div>
            </div>

            {/* Field Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                Field Observations & History
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any tell-tale gauge readings, load changes, water seepage, or recent seismic vibrations..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running Structural Diagnostics...
                </>
              ) : (
                <>
                  <SearchCheck className="w-4 h-4" />
                  Analyze Structural Integrity
                </>
              )}
            </button>
          </div>
        </div>

        {/* Diagnostic Results (7 cols) */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Taxonomy Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                    {result.structural_element}
                  </span>
                  {result.is_structural_hazard && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      ACTIVE STRUCTURAL HAZARD
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-white">
                  {result.crack_type}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-500 block">Severity</span>
                    <span className={`text-base font-bold ${
                      result.severity === 'Critical' ? 'text-rose-500' :
                      result.severity === 'High' ? 'text-rose-400' :
                      result.severity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {result.severity}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-500 block">Risk Score</span>
                    <span className="text-base font-bold text-amber-400">{result.risk_score} / 100</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-500 block">Est. Width</span>
                    <span className="text-base font-mono font-bold text-slate-200">{result.estimated_width_mm}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-500 block">Orientation</span>
                    <span className="text-xs font-bold text-slate-300 mt-1 block truncate">{result.crack_orientation}</span>
                  </div>
                </div>
              </div>

              {/* Structural Implication & Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Probable Root Causes
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.probable_causes?.map((cause, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    Structural Integrity Implication
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.structural_implication}
                  </p>
                </div>
              </div>

              {/* Engineering Remediation Plan */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-rose-400" />
                  Engineering Remediation Protocol (PE/SE Stamped Workflow)
                </h4>

                <div className="space-y-3">
                  {result.remediation_plan?.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {step.step}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{step.technique}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                            {step.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {result.monitoring_recommendation && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                    <span className="font-bold block mb-0.5">Sensor Monitoring Guidance:</span>
                    {result.monitoring_recommendation}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[400px]">
              <SearchCheck className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-semibold text-slate-400 mb-1">Awaiting Crack Inspection Photo</h3>
              <p className="text-xs max-w-sm text-slate-500">
                Upload a photo of a cracked beam, column, or wall or use the demo to inspect crack propagation and remediation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

