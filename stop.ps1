# ============================================================
#  Multimodal Construction Intelligence Platform — Stop Services
#  Usage: .\stop.ps1
# ============================================================

$ErrorActionPreference = "SilentlyContinue"

function Write-Step($msg) { Write-Host "`n▶  $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "   ✔  $msg" -ForegroundColor Green }

# ── 1. Stop FastAPI Backend (port 8000) ──────────────────────
Write-Step "Stopping FastAPI backend (port 8000)..."
$backendPids = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue |
               Select-Object -ExpandProperty OwningProcess -Unique -ErrorAction SilentlyContinue

if ($backendPids) {
    foreach ($pidToKill in $backendPids) {
        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
    }
    Write-Ok "Stopped FastAPI backend process(es) on port 8000."
} else {
    Write-Host "   –  No process found listening on port 8000." -ForegroundColor DarkGray
}

# ── 2. Stop Vite Frontend (port 5173) ────────────────────────
Write-Step "Stopping Vite dev server (port 5173)..."
$frontendPids = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue |
                Select-Object -ExpandProperty OwningProcess -Unique -ErrorAction SilentlyContinue

if ($frontendPids) {
    foreach ($pidToKill in $frontendPids) {
        Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
    }
    Write-Ok "Stopped Vite dev server process(es) on port 5173."
} else {
    Write-Host "   –  No process found listening on port 5173." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "  All services stopped successfully." -ForegroundColor Green
Write-Host ""
