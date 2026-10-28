import React from 'react';
import { 
  ShieldCheck, 
  SearchCheck, 
  Home, 
  CalendarRange, 
  CloudSun, 
  ClipboardList,
  Bot, 
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
      description: 'Computer vision surveillance detecting PPE compliance (helmets, high-vis vests, boots, harnesses) and OSHA 1926 hazard violations with 0-100 scoring.',
      icon: ShieldCheck,
      color: 'amber',
      tag: 'OSHA 1926 & ISO 45001',
      badge: 'Multimodal Vision'
    },
    {
      id: 'cracks',
      title: 'Structural Crack Detection & Forensics',
      description: 'Forensic diagnostics classifying crack taxonomy (diagonal shear, flexural, settlement), severity rating, width estimation, and composite remediation plans.',
      icon: SearchCheck,
      color: 'rose',
      tag: 'ACI 224R & NDT',
      badge: 'Vision Diagnostics'
    },
    {
      id: 'planning',
      title: 'Construction Project Planner',
      description: 'Automated quantity takeoffs for cement, sand, aggregate, and steel in Indian Rupees (₹), week-wise CPM schedules, and AI architectural blueprint preview.',
      icon: CalendarRange,
      color: 'blue',
      tag: 'BOM Takeoff & ₹ Costing',
      badge: 'Activity 3.1'
    },
    {
      id: 'valuation',
      title: 'Real Estate Valuation Engine',
      description: 'Algorithmic property valuation with location benchmarks, 5-year capital appreciation, gross rental yield (ROI), and comparable sales in Indian Rupees (₹).',
      icon: Home,
      color: 'emerald',
      tag: 'INR (₹) Appraisal & ROI',
      badge: 'Activity 3.2'
    },
    {
      id: 'daily-assistant',
      title: 'Daily Site Assistant',
      description: 'Daily task sequencing by trade, manpower allocation, equipment staging, mandatory safety checks, and operational risk mitigation alerts.',
      icon: ClipboardList,
      color: 'amber',
      tag: 'Task Sequence & Logistics',
      badge: 'Activity 5.2'
    },
    {
      id: 'weather-advisor',
      title: 'Weather-Aware Risk Advisor',
      description: 'Microclimate hazard evaluation for concrete washouts, crane wind limits (38 km/h), and excavation stability with clear GO / CAUTION / NO-GO directives.',
      icon: CloudSun,
      color: 'cyan',
      tag: 'GO / NO-GO Decisions',
      badge: 'Activity 5.3'
    },
    {
      id: 'chatbot',
      title: 'Construction Intelligence Chatbot',
      description: 'Conversational civil engineering assistant delivering technical explanations, building codes (IS 456, ACI 318, OSHA), formulas, and actionable directives.',
      icon: Bot,
      color: 'indigo',
      tag: 'IS 456, ACI, NBC 2016',
      badge: 'Activity 5.1'
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
            Empowering construction managers, structural engineers, and safety officers with multimodal vision inspection, Indian Rupees (₹) project planning, real estate valuation, and weather-aware decision advisory.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('planning')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <CalendarRange className="w-4 h-4" />
              Launch Project Planner (₹)
            </button>
            <button
              onClick={() => setActiveTab('weather-advisor')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <CloudSun className="w-4 h-4 text-cyan-400" />
              Weather GO / NO-GO Advisor
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
            <span className="text-xs font-medium uppercase tracking-wider">Crack Forensics</span>
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {stats?.critical_crack_count ?? 2}
          </div>
          <span className="text-xs text-rose-400 flex items-center gap-1 mt-1">
            High Severity Elements
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Project Plans</span>
            <Activity className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {(stats?.total_project_plans || 0) + 4}
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            Indian Rupee (₹) Estimates
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
            Multimodal Reasoning Layer
          </span>
        </div>
      </div>

      {/* Core Platform Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core Construction Intelligence Modules</h2>
            <p className="text-sm text-slate-400">Select any module below to launch the workflow with sample presets and real-time AI reasoning.</p>
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
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
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
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
