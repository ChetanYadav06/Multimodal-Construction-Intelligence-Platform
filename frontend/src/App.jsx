import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import SafetyView from './components/SafetyView';
import CrackView from './components/CrackView';
import ValuationView from './components/ValuationView';
import PlanningView from './components/PlanningView';
import DailySiteView from './components/DailySiteView';
import KnowledgeView from './components/KnowledgeView';
import HistoryView from './components/HistoryView';
import { fetchPlatformStatus, fetchDashboardStats, fetchDemoSamples } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [engineStatus, setEngineStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [demoSamples, setDemoSamples] = useState(null);

  const loadData = async () => {
    try {
      const [statusData, statsData, samplesData] = await Promise.all([
        fetchPlatformStatus().catch(() => null),
        fetchDashboardStats().catch(() => null),
        fetchDemoSamples().catch(() => null)
      ]);
      setEngineStatus(statusData);
      setStats(statsData);
      setDemoSamples(samplesData);
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDataSaved = () => {
    fetchDashboardStats().then(setStats).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        engineStatus={engineStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            setActiveTab={setActiveTab}
            stats={stats}
            demoSamples={demoSamples}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyView
            demoSamples={demoSamples}
            onInspectionSaved={handleDataSaved}
          />
        )}

        {activeTab === 'cracks' && (
          <CrackView
            demoSamples={demoSamples}
            onAnalysisSaved={handleDataSaved}
          />
        )}

        {activeTab === 'valuation' && (
          <ValuationView
            demoSamples={demoSamples}
            onValuationSaved={handleDataSaved}
          />
        )}

        {activeTab === 'planning' && (
          <PlanningView
            demoSamples={demoSamples}
            onPlanSaved={handleDataSaved}
          />
        )}

        {activeTab === 'daily-site' && (
          <DailySiteView
            demoSamples={demoSamples}
            onReportSaved={handleDataSaved}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeView
            demoSamples={demoSamples}
            onQuerySaved={handleDataSaved}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Multimodal Construction Intelligence Platform</span>
            <span>•</span>
            <span>FastAPI + Vite React + Groq / Multimodal Vision</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>OSHA 1926</span>
            <span>•</span>
            <span>ACI 318 / 224R</span>
            <span>•</span>
            <span>IBC 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

