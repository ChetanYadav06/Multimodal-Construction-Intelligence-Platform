// API Client for Multimodal Construction Intelligence Platform

const API_BASE = '/api';

export async function fetchPlatformStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error('Failed to fetch platform status');
  return res.json();
}

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function fetchDemoSamples() {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch samples');
  return res.json();
}

export async function analyzeSafety(formData) {
  const res = await fetch(`${API_BASE}/safety/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Safety analysis failed' }));
    throw new Error(err.detail || 'Safety analysis failed');
  }
  return res.json();
}

export async function analyzeCrack(formData) {
  const res = await fetch(`${API_BASE}/cracks/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Crack analysis failed' }));
    throw new Error(err.detail || 'Crack analysis failed');
  }
  return res.json();
}

export async function evaluateValuation(payload) {
  const res = await fetch(`${API_BASE}/valuation/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Valuation failed' }));
    throw new Error(err.detail || 'Valuation failed');
  }
  return res.json();
}

export async function generateProjectPlan(payload) {
  const res = await fetch(`${API_BASE}/planning/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Planning generation failed' }));
    throw new Error(err.detail || 'Planning generation failed');
  }
  return res.json();
}

export async function getDailySiteAdvisory(payload) {
  const res = await fetch(`${API_BASE}/daily-site/advisory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Daily site advisory failed' }));
    throw new Error(err.detail || 'Daily site advisory failed');
  }
  return res.json();
}

export async function queryKnowledgeBase(payload) {
  const res = await fetch(`${API_BASE}/knowledge/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Knowledge query failed' }));
    throw new Error(err.detail || 'Knowledge query failed');
  }
  return res.json();
}

export async function fetchModuleHistory(moduleName) {
  const res = await fetch(`${API_BASE}/history/${moduleName}?limit=30`);
  if (!res.ok) throw new Error('Failed to fetch module history');
  return res.json();
}

