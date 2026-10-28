import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Send, 
  Sparkles, 
  Loader2, 
  Bookmark, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Code2
} from 'lucide-react';
import { queryKnowledgeBase } from '../api';

export default function KnowledgeView({ demoSamples, onQuerySaved }) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('Structural Engineering');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const samplePrompts = [
    {
      q: 'What are the minimum curing requirements and testing protocols for high-strength concrete under ACI 308R?',
      d: 'Concrete Technology'
    },
    {
      q: 'What are the OSHA 1926.501 fall protection mandates for unprotected walking-working edges above 6 feet?',
      d: 'Site Safety OSHA'
    },
    {
      q: 'Explain the difference between shear vs flexural cracking in reinforced concrete beams and their respective repair codes.',
      d: 'Structural Engineering'
    },
    {
      q: 'What are the standard wind load design combinations for temporary tower cranes according to ASCE 7-22?',
      d: 'Building Codes'
    }
  ];

  const handleRunQuery = async (customQuery, customDomain) => {
    const q = customQuery || query;
    const d = customDomain || domain;
    if (!q.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await queryKnowledgeBase({ query: q, domain: d });
      setResult(data);
      if (onQuerySaved) onQuerySaved();
    } catch (err) {
      setError(err.message || 'Knowledge query failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpenCheck className="w-7 h-7 text-indigo-400" />
          Construction Knowledge & Building Code Assistant
        </h2>
        <p className="text-sm text-slate-400">
          Instant civil engineering intelligence referencing the International Building Code (IBC 2024), ACI 318, ASTM specifications, and OSHA 1926 safety regulations.
        </p>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
          Frequently Referenced Engineering Inquiries
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p.q);
                setDomain(p.d);
                handleRunQuery(p.q, p.d);
              }}
              className="text-left p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all text-xs text-slate-300 flex items-start justify-between gap-2 group"
            >
              <span>{p.q}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700 shrink-0 group-hover:bg-indigo-500/20">
                {p.d}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Specialized Domain:</span>
          {['Structural Engineering', 'Concrete Technology', 'Site Safety OSHA', 'Building Codes', 'Construction Management'].map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setDomain(dom)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                domain === dom
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRunQuery();
            }}
            placeholder="Ask any structural engineering, code standard, or concrete question..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleRunQuery()}
            disabled={loading || !query.trim()}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Ask</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Answer Output */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Answer Content Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {result.domain}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
              {result.answer_markdown}
            </div>

            {/* Applicable Codes & Standards */}
            {result.applicable_codes_standards?.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4" />
                  Applicable Building Codes & Regulatory References
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.applicable_codes_standards.map((code, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono font-medium"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Critical Formulas */}
            {result.critical_formulas?.length > 0 && (
              <div className="pt-3 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  Governing Engineering Formulas & Limits
                </h4>
                <div className="space-y-1">
                  {result.critical_formulas.map((form, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300/90"
                    >
                      {form}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Field Recommendations */}
            {result.key_recommendations?.length > 0 && (
              <div className="pt-3 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Key Field Implementation Directives
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.key_recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up Questions */}
            {result.follow_up_questions?.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Recommended Deep-Dive Inquiries
                </h4>
                <div className="space-y-1.5">
                  {result.follow_up_questions.map((fq, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(fq);
                        handleRunQuery(fq);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 flex items-center justify-between group transition-colors"
                    >
                      <span>{fq}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

