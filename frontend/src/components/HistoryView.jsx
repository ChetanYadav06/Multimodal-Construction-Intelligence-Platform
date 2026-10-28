import React, { useState, useEffect } from 'react';
import { 
  History, 
  ShieldCheck, 
  SearchCheck, 
  Home, 
  CalendarRange, 
  CloudSun, 
  BookOpenCheck, 
  Loader2, 
  FileJson, 
  Eye, 
  X,
  RefreshCw,
  Search
} from 'lucide-react';
import { fetchModuleHistory } from '../api';

export default function HistoryView() {
  const [activeModule, setActiveModule] = useState('safety');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const modules = [
    { id: 'safety', label: 'Safety Audits', icon: ShieldCheck, color: 'text-amber-400' },
    { id: 'cracks', label: 'Crack Forensics', icon: SearchCheck, color: 'text-rose-400' },
    { id: 'valuation', label: 'Valuations', icon: Home, color: 'text-emerald-400' },
    { id: 'planning', label: 'Project Plans', icon: CalendarRange, color: 'text-sky-400' },
    { id: 'daily-site', label: 'Daily Logs', icon: CloudSun, color: 'text-cyan-400' },
    { id: 'knowledge', label: 'Knowledge Queries', icon: BookOpenCheck, color: 'text-indigo-400' },
  ];

  const loadRecords = async (mod) => {
    setLoading(true);
    try {
      const data = await fetchModuleHistory(mod);
      setRecords(data.records || []);
    } catch (err) {
      console.error('Failed to load history:', err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords(activeModule);
  }, [activeModule]);

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    const idMatch = (r.id || '').toLowerCase().includes(q);
    const dateMatch = (r.timestamp || r.date || '').toLowerCase().includes(q);
    const typeMatch = (r.crack_type || r.property_type || r.project_name || r.query || '').toLowerCase().includes(q);
    return idMatch || dateMatch || typeMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-7 h-7 text-amber-400" />
            Inspection Audit Records & Historical Storage
          </h2>
          <p className="text-sm text-slate-400">
            Immutable SQLite records archiving site safety surveillance, structural crack telemetry, valuations, and daily reports.
          </p>
        </div>
        <button
          onClick={() => loadRecords(activeModule)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Records
        </button>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${m.color}`} />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Filter ${activeModule} records by ID, date, or title...`}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Records Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-2" />
            <span className="text-xs">Loading records from SQLite...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
            <FileJson className="w-10 h-10 text-slate-600 mb-2" />
            <span className="text-sm font-semibold text-slate-400">No records found</span>
            <span className="text-xs text-slate-500 mt-1">Run an analysis in the respective tab to generate and save audit entries.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Record ID</th>
                  <th className="py-2.5 px-4 font-semibold">Timestamp / Date</th>
                  <th className="py-2.5 px-4 font-semibold">Key Metric / Classification</th>
                  <th className="py-2.5 px-4 font-semibold">Status / Score</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-bold text-amber-400">{r.id}</td>
                    <td className="py-2.5 px-4 text-slate-400 font-sans">
                      {r.timestamp ? new Date(r.timestamp).toLocaleString() : r.date || '—'}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-300">
                      {r.crack_type || r.property_type || r.project_name || r.location_name || r.query || 'Inspection Event'}
                    </td>
                    <td className="py-2.5 px-4">
                      {r.safety_score !== undefined && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {r.safety_score}/100 • {r.compliance_status || r.risk_level}
                        </span>
                      )}
                      {r.severity && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          {r.severity} ({r.risk_score}/100)
                        </span>
                      )}
                      {r.estimated_fair_value && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ${r.estimated_fair_value.toLocaleString()}
                        </span>
                      )}
                      {r.total_estimated_budget && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          ${r.total_estimated_budget.toLocaleString()}
                        </span>
                      )}
                      {r.site_safety_index !== undefined && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          Index: {r.site_safety_index}/100
                        </span>
                      )}
                      {r.domain && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {r.domain}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-amber-400" />
                  Audit Record: {selectedRecord.id}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedRecord.timestamp || selectedRecord.date}
                </span>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs text-slate-300">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 whitespace-pre-wrap leading-relaxed text-amber-300/90 overflow-x-auto">
                {JSON.stringify(selectedRecord.details || selectedRecord, null, 2)}
              </pre>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

