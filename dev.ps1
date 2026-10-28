# ============================================================
#  Multimodal Construction Intelligence Platform — Dev Launcher
#  Usage: .\dev.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

# ── Helpers ─────────────────────────────────────────────────
function Write-Step($msg) {
    Write-Host "`n▶  $msg" -ForegroundColor Cyan
}
function Write-Ok($msg) {
    Write-Host "   ✔  $msg" -ForegroundColor Green
}
function Write-Warn($msg) {
    Write-Host "   ⚠  $msg" -ForegroundColor Yellow
}
function Wait-Port($port, $timeoutSec = 20) {
    $deadline = (Get-Date).AddSeconds($timeoutSec)
    while ((Get-Date) -lt $deadline) {
        $ok = (Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue).TcpTestSucceeded
        if ($ok) { return $true }
        Start-Sleep -Milliseconds 500
    }
    return $false
}

# ── 1. Backend (FastAPI / Uvicorn) ───────────────────────────
Write-Step "Checking Python environment & starting FastAPI backend (port 8000)..."

$venvPython = Join-Path $Root "venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Warn "Virtual environment not found at $venvPython. Using system python."
    $pythonCmd = "python"
} else {
    $pythonCmd = "'$venvPython'"
}

$alreadyUpBackend = (Test-NetConnection -ComputerName localhost -Port 8000 -WarningAction SilentlyContinue).TcpTestSucceeded
if ($alreadyUpBackend) {
    Write-Ok "Backend is already running on port 8000."
} else {
    $backendCmd = "cd '$Root'; & $pythonCmd -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"
    Start-Process powershell `
        -ArgumentList "-NoExit", "-Command", "$backendCmd" `
        -WindowStyle Normal

    Write-Host "   Waiting for FastAPI backend to accept connections..." -ForegroundColor DarkGray
    $backendReady = Wait-Port 8000 -timeoutSec 15
    if ($backendReady) {
        Write-Ok "FastAPI Backend is online on port 8000."
    } else {
        Write-Warn "Backend didn't respond within 15 s. Check the spawned backend console."
    }
}

# ── 2. Frontend (React + Vite) ───────────────────────────────
Write-Step "Starting Vite frontend (port 5173)..."
$frontendDir = Join-Path $Root "frontend"

$alreadyUpFrontend = (Test-NetConnection -ComputerName localhost -Port 5173 -WarningAction SilentlyContinue).TcpTestSucceeded
if ($alreadyUpFrontend) {
    Write-Ok "Frontend is already running on port 5173."
} else {
    Start-Process powershell `
        -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev" `
        -WindowStyle Normal

    Write-Host "   Waiting for Vite frontend..." -ForegroundColor DarkGray
    $frontendReady = Wait-Port 5173 -timeoutSec 15
    if ($frontendReady) {
        Write-Ok "Vite Frontend is online on port 5173."
    } else {
        Write-Warn "Frontend didn't respond within 15 s. Check the spawned frontend console."
    }
}

# ── 3. Done ──────────────────────────────────────────────────
Write-Host ""
Write-Host "══════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "  Multimodal Construction Intelligence Platform is LIVE!" -ForegroundColor White
Write-Host ""
Write-Host "  Frontend Dashboard →  http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend API Docs   →  http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  System Health      →  http://localhost:8000/api/status" -ForegroundColor Cyan
Write-Host ""
Write-Host "  To stop everything, run:  .\stop.ps1" -ForegroundColor Yellow
Write-Host "══════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host ""
