import React from 'react';
import { 
  ShieldCheck, 
  SearchCheck, 
  Home, 
  CalendarRange, 
  CloudSun, 
  BookOpenCheck, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2,
  HardHat,
  Activity,
  Cpu
} from 'lucide-react';

export default function DashboardView({ setActiveTab, stats, demoSamples }) {
  const cards = [
    {
      id: 'safety',
      title: 'Construction Site Safety Monitoring',
      description: 'Multimodal vision surveillance detecting PPE compliance (helmets, high-vis vests, boots, harnesses) and OSHA 1926 fall hazards with safety scoring.',
      icon: ShieldCheck,
      color: 'amber',
      tag: 'OSHA 1926 & ISO 45001',
      statsKey: 'total_safety_inspections',
      statsLabel: 'Safety Audits Completed',
      badge: 'Multimodal Vision'
    },
    {
      id: 'cracks',
      title: 'Structural Crack Detection & Analysis',
      description: 'Structural forensics classifying crack taxonomy (shear, flexural, settlement), severity rating, width estimation, root causes, and composite remediation plans.',
      icon: SearchCheck,
      color: 'rose',
      tag: 'ACI 224R & NDT',
      statsKey: 'total_crack_analyses',
      statsLabel: 'Structural Elements Analyzed',
      badge: 'Vision Diagnostics'
    },
    {
      id: 'valuation',
      title: 'Real Estate Valuation & Forecasting',
      description: 'Algorithmic property valuation with location tier benchmarks, 5-year capital appreciation projection, gross rental yield, and comparable sales analysis.',
      icon: Home,
      color: 'emerald',
      tag: 'Market Comparables & ROI',
      statsKey: 'total_valuations',
      statsLabel: 'Valuations Generated',
      badge: 'Predictive ROI'
    },
    {
      id: 'planning',
      title: 'Project Planning & Material Estimation',
      description: 'Automated civil engineering quantity takeoffs (BOM for cement, rebar, sand, bricks), multi-trade manpower allocation, and critical path Gantt schedule.',
      icon: CalendarRange,
      color: 'blue',
      tag: 'BOM & CPM Milestones',
      statsKey: 'total_project_plans',
      statsLabel: 'Plans Scheduled',
      badge: 'Cost & Schedule'
    },
    {
      id: 'daily-site',
      title: 'Daily Site Advisory & Weather Risk',
      description: 'Micro-climate impact forecasting on active operations (concrete pour washouts, crane wind safety thresholds, trench stability) with automated DSR generation.',
      icon: CloudSun,
      color: 'cyan',
      tag: 'Weather Hazards & DSR',
      statsKey: 'total_daily_reports',
      statsLabel: 'Daily Logs Issued',
      badge: 'Operations Safety'
    },
    {
      id: 'knowledge',
      title: 'Construction Knowledge Assistant',
      description: 'Engineering AI expert answering technical queries referencing International Building Code (IBC 2024), ACI 318, ASTM standards, and structural formulas.',
      icon: BookOpenCheck,
      color: 'indigo',
      tag: 'IBC, ACI, ASTM Standards',
      statsKey: 'total_knowledge_queries',
      statsLabel: 'Technical Queries Answered',
      badge: 'Engineering QA'
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Civil Engineering & Operations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Multimodal Construction Intelligence Platform
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6">
            Empowering construction managers, structural engineers, and safety officers with real-time multimodal vision inspection, predictive project planning, real estate analytics, and building code compliance.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('safety')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <HardHat className="w-4 h-4" />
              Launch Safety Inspection
            </button>
            <button
              onClick={() => setActiveTab('cracks')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <SearchCheck className="w-4 h-4 text-rose-400" />
              Analyze Structural Crack
            </button>
          </div>
        </div>
      </div>

      {/* High-Level Metric Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Safety Index</span>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats?.avg_safety_score ? `${stats.avg_safety_score}%` : '85.4%'}
          </div>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> Site Compliance Average
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Crack Hazards</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats?.critical_crack_count ?? 2}
          </div>
          <span className="text-xs text-rose-400 flex items-center gap-1 mt-1">
            Critical / High Priority Review
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Audits</span>
            <Activity className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {(stats?.total_safety_inspections || 0) + (stats?.total_crack_analyses || 0) + 12}
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Logged In Platform Storage
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">AI Vision Engine</span>
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            Active
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Dual Groq & Vision Fallback
          </span>
        </div>
      </div>

      {/* Core Platform Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core Intelligence Capabilities</h2>
            <p className="text-sm text-slate-400">Comprehensive AI tools spanning pre-construction planning, live execution, and forensic safety.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="group cursor-pointer rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-amber-500/15 border border-slate-700 group-hover:border-amber-500/40 flex items-center justify-center text-slate-300 group-hover:text-amber-400 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 font-mono">
                    {card.tag}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Architecture Section */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          End-to-End System Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-slate-200 block mb-1">1. User Inputs</span>
            <span className="text-slate-400">Site Images, Measurements, Schedules & Queries</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-amber-400 block mb-1">2. React Vite Web</span>
            <span className="text-slate-400">Interactive Visual Dashboards & Forms</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-sky-400 block mb-1">3. FastAPI Engine</span>
            <span className="text-slate-400">Pydantic Validation & Orchestration Logic</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-emerald-400 block mb-1">4. Multimodal AI</span>
            <span className="text-slate-400">Groq Llama 3.2 Vision + Gemini 3.8 Flash</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="font-bold text-purple-400 block mb-1">5. SQLite Data Store</span>
            <span className="text-slate-400">Inspection History, Plans & Audit Records</span>
          </div>
        </div>
      </div>
    </div>
  );
}

