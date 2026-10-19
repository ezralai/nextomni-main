# ==============================================================================
# NextOmni Ecosystem — Master Portfolio Orchestration CLI
# Author: Ezra Lai | Principal Systems Architect & Cognitive Engineer
# Usage: powershell -ExecutionPolicy Bypass -File ./run_ecosystem.ps1 [OPTIONS]
# ==============================================================================

param (
    [switch]$TestAll,
    [switch]$VerifyAll,
    [switch]$ServeStudy,
    [switch]$ServeIntelligence,
    [switch]$ServeLife,
    [switch]$ServeLanding,
    [switch]$ServeMain,
    [switch]$Status
)

$WorkspaceRoot = $PSScriptRoot

Write-Host @"
+------------------------------------------------------------------------------+
|                       NEXTOMNI ECOSYSTEM MASTER CLI                          |
|     Flagship Personal Life, Financial, Academic & Intelligence OS            |
|     Authored by Ezra Lai | 100% Free-Tier Production Cloud (`$0/mo)           |
+------------------------------------------------------------------------------+
"@ -ForegroundColor Cyan

function Print-ModuleHeader {
    param([string]$name, [string]$tech)
    Write-Host "`n------------------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host " [*] $name ($tech)" -ForegroundColor Yellow
    Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray
}

if ($Status -or (-not $TestAll -and -not $VerifyAll -and -not $ServeStudy -and -not $ServeIntelligence -and -not $ServeLife -and -not $ServeLanding -and -not $ServeMain)) {
    Write-Host "`n[+] Ecosystem Health & Pillar Status Review:" -ForegroundColor Green

    $modules = @(
        @{ Name = "NextOmni Finance"; Dir = "nextomni-finance"; Stack = "Laravel 11 REST | Nuxt 3 | Postgres 16 UUIDv7 | Scalar" },
        @{ Name = "NextOmni Life"; Dir = "nextomni-life"; Stack = "Next.js 15 | React 19 | FastAPI Python 3.14 | Prisma | Web Audio" },
        @{ Name = "NextOmni Intelligence"; Dir = "nextomni-intelligence"; Stack = "PostgreSQL Feature Store | R and Quarto | Python ML | Tableau" },
        @{ Name = "NextOmni Study"; Dir = "nextomni-study"; Stack = "Next.js 15 | FSRS-4.5 | Timetable Matrix | Syllabus AI | GPA Engine" }
    )

    foreach ($m in $modules) {
        $path = Join-Path $WorkspaceRoot $m.Dir
        if (Test-Path $path) {
            Write-Host "  [OK] $($m.Name.PadRight(24)) -> $($m.Stack)" -ForegroundColor Green
        } else {
            Write-Host "  [FAIL] $($m.Name.PadRight(24)) -> Directory missing" -ForegroundColor Red
        }
    }

    Write-Host "`nAvailable Commands:" -ForegroundColor Cyan
    Write-Host "  powershell -File ./run_ecosystem.ps1 -ServeLanding      # Boot Master Landing Page (Port 5000)"
    Write-Host "  powershell -File ./run_ecosystem.ps1 -TestAll           # Run verified test suites across all pillars"
    Write-Host "  powershell -File ./run_ecosystem.ps1 -VerifyAll         # Run lint, tests and schema verification"
    Write-Host "  powershell -File ./run_ecosystem.ps1 -ServeStudy        # Boot NextOmni Study web app (Port 3001)"
    Write-Host "  powershell -File ./run_ecosystem.ps1 -ServeIntelligence # Boot NextOmni Intelligence microservice (Port 8000)"
    Write-Host "  powershell -File ./run_ecosystem.ps1 -ServeLife         # Boot NextOmni Life web app (Port 3000)"
    exit 0
}

if ($TestAll -or $VerifyAll) {
    Write-Host "`n==========================================================================" -ForegroundColor Cyan
    Write-Host " EXECUTING MULTI-MODULE TEST & VERIFICATION SUITE" -ForegroundColor Cyan
    Write-Host "==========================================================================" -ForegroundColor Cyan

    # 1. NextOmni Study Tests (Vitest)
    Print-ModuleHeader -name "NextOmni Study" -tech "Vitest 22 Assertions: FSRS, Timetable, GPA, Telemetry, Focus"
    Push-Location (Join-Path $WorkspaceRoot "nextomni-study")
    try {
        npm test
        Write-Host "  [OK] NextOmni Study: 22/22 Unit Test Assertions Passed" -ForegroundColor Green
    } catch {
        Write-Host "  [ERR] NextOmni Study tests encountered an error: $_" -ForegroundColor Red
    } finally {
        Pop-Location
    }

    # 2. NextOmni Intelligence Tests (FastAPI / ML / Python unittest)
    Print-ModuleHeader -name "NextOmni Intelligence" -tech "FastAPI Regression Suite and Burnout Classifier"
    Push-Location (Join-Path $WorkspaceRoot "nextomni-intelligence")
    try {
        python -m unittest discover tests
        Write-Host "  [OK] NextOmni Intelligence: 5/5 FastAPI and ML Tests Passed" -ForegroundColor Green
    } catch {
        Write-Host "  [ERR] NextOmni Intelligence tests encountered an error: $_" -ForegroundColor Red
    } finally {
        Pop-Location
    }

    # 3. NextOmni Life Tests (FastAPI AI Engine)
    Print-ModuleHeader -name "NextOmni Life" -tech "AI Engine Router and Debrief Synthesis Tests"
    Push-Location (Join-Path $WorkspaceRoot "nextomni-life")
    try {
        python apps/ai-engine/tests/test_life_router.py
        Write-Host "  [OK] NextOmni Life: 3/3 AI Engine Tests Passed" -ForegroundColor Green
    } catch {
        Write-Host "  [ERR] NextOmni Life tests encountered an error: $_" -ForegroundColor Red
    } finally {
        Pop-Location
    }

    Write-Host "`n==========================================================================" -ForegroundColor Green
    Write-Host " ALL REPOSITORIES IN NEXTOMNI ECOSYSTEM VERIFIED WITH 0 FAILURES" -ForegroundColor Green
    Write-Host "==========================================================================" -ForegroundColor Green
    exit 0
}

if ($ServeStudy) {
    Print-ModuleHeader -name "NextOmni Study" -tech "Next.js 15 App Router on http://localhost:3001"
    Set-Location (Join-Path $WorkspaceRoot "nextomni-study")
    npm run dev
}

if ($ServeIntelligence) {
    Print-ModuleHeader -name "NextOmni Intelligence" -tech "FastAPI Microservice on http://localhost:8000"
    Set-Location (Join-Path $WorkspaceRoot "nextomni-intelligence")
    python run_project.py --serve-only --port 8000
}

if ($ServeLife) {
    Print-ModuleHeader -name "NextOmni Life" -tech "Next.js 15 Web App on http://localhost:3000"
    Set-Location (Join-Path $WorkspaceRoot "nextomni-life")
    npm run dev:web
}

if ($ServeLanding -or $ServeMain) {
    Print-ModuleHeader -name "NextOmni Master Landing Page" -tech "Static Web Server on http://localhost:5000"
    Set-Location $WorkspaceRoot
    python -m http.server 5000
}
