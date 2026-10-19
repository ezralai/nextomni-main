# NextOmni Ecosystem: Flagship Multi-Domain Personal Operating System

[![Ecosystem: NextOmni](https://img.shields.io/badge/Ecosystem-NextOmni_Suite-indigo?style=for-the-badge)](https://github.com/ezralai)
[![Author](https://img.shields.io/badge/Author-Ezra_Lai-cyan?style=for-the-badge)](https://github.com/ezralai)
[![Cloud Architecture](https://img.shields.io/badge/Production_Cloud-100%25_Free_Tier_($0/mo)-emerald?style=for-the-badge)](https://vercel.com)
[![Zero Mockups](https://img.shields.io/badge/Guarantees-Real_ACID_%26_Zero_Mockups-blue?style=for-the-badge)](https://github.com/ezralai)

> **NextOmni** is a production-grade, multi-domain personal operating system and engineering portfolio authored by **Ezra Lai**. Engineered to demonstrate senior-level technical depth across backend systems, distributed architectures, reactive frontends, and applied data science/ML. All modules run on **100% free-tier production cloud deployments ($0/month forever)** with zero mockups, real ACID guarantees, and live interactive recruiter demo modes.

---

## 🏛️ Master Ecosystem Architecture & Cross-Module Telemetry Flow

```mermaid
flowchart TB
    User["Engineering Recruiter / Executive Reviewer"]

    subgraph Edge["Global Edge CDN & Presentation Layer (Vercel Edge / Netlify)"]
        FinWeb["NextOmni Finance Web<br/>(Nuxt 3 • Vue 3 • Pinia • TypeScript)"]
        LifeWeb["NextOmni Life Web<br/>(Next.js 15 App Router • React 19 • PWA)"]
        StudyWeb["NextOmni Study Web<br/>(Next.js 15 App Router • FSRS-4.5 • Timetable Matrix)"]
    end

    subgraph Gateway["Microservice & Compute Layer (Render / Koyeb / Fly.io Containers)"]
        FinAPI["Finance REST API Gateway<br/>(Laravel 11 • PHP 8.3 CLI • Zend OPcache • Scalar 3.1)"]
        LifeAI["Life AI Engine<br/>(FastAPI • Python 3.14 • Gemini Sentiment • Web Audio)"]
        StudyAPI["Study Engine & Matrix Solver<br/>(Next.js Serverless Route Handlers • OpenAPI 3.1)"]
    end

    subgraph Storage["Managed Persistence Layer (Supabase / Neon Cloud PostgreSQL 16)"]
        Pooler["PgBouncer Connection Pooler (Port 6543)"]
        FinDB[("finance_ledger<br/>• UUIDv7 Sequential PKs<br/>• NUMERIC(15,4) BCMath<br/>• Bank Statement SHA-256 Deduplication")]
        LifeDB[("life_os<br/>• Prisma ORM Client<br/>• Circadian Logs & Energy Rhythm<br/>• 365-Day Habit Telemetry")]
        FeatureStore[("nextomni_telemetry<br/>• focus_sessions<br/>• academic_tasks<br/>• habit_logs<br/>• circadian_energy_logs")]
    end

    subgraph Intelligence["Data Science & Causal Inference Hub (NextOmni Intelligence)"]
        R_Stats["R & Quarto Analytics<br/>• Two-Way ANOVA & Tukey HSD<br/>• Multivariate OLS Flow Regression<br/>• Kaplan-Meier Habit Survival Decay"]
        Py_ML["Python Machine Learning<br/>• 7-Day Burnout Risk GBM Classifier<br/>• Time-Series Energy Forecasting"]
        Tableau["Tableau LOD Storyboard<br/>• Executive KPI Radar Clock"]
    end

    User -->|Interactive Recruiter Session| Edge
    FinWeb -->|REST / Bearer Auth| FinAPI
    LifeWeb -->|HTTP / JSON| LifeAI
    StudyWeb -->|API Handlers| StudyAPI

    FinAPI --> Pooler --> FinDB
    LifeAI --> Pooler --> LifeDB
    StudyAPI -->|ACID Telemetry Dispatch| Pooler --> FeatureStore

    FeatureStore --> R_Stats
    FeatureStore --> Py_ML
    FeatureStore --> Tableau
```

---

## 💎 The Four Ecosystem Pillars

| Pillar Module | Primary Technologies | Architecture & Key Features | Recruiter Live Surface | Test Assertions |
| :--- | :--- | :--- | :--- | :--- |
| **[NextOmni Finance](file:///c:/ezra-projects/nextomni/nextomni-finance)** | Laravel 11 (PHP 8.3), Nuxt 3, PostgreSQL 16 (UUIDv7, PgBouncer), Scalar OpenAPI 3.1 | Multi-currency ledgers, BCMath high-precision financial arithmetic, non-custodial Malaysian bank statement parsing (Maybank, CIMB, TNG, GrabPay) with SHA-256 deduplication. | `https://nextomni-finance.vercel.app`<br/>[Scalar API Live](https://nextomni-finance.onrender.com/docs) | 66 Pest Tests / 550 Assertions |
| **[NextOmni Life](file:///c:/ezra-projects/nextomni/nextomni-life)** | Next.js 15 (React 19 App Router), Tailwind CSS, FastAPI (Python 3.14), Prisma ORM | Atomic habit streak heatmaps (365-day SVG), Huberman circadian energy rhythm tracker, Pomodoro/Ultradian focus engine with procedural 40Hz binaural beats, CBT reflective journaling. | `http://localhost:3000/life`<br/>[FastAPI Docs](http://localhost:8000/docs) | CI Pipeline & Pytest |
| **[NextOmni Intelligence](file:///c:/ezra-projects/nextomni/nextomni-intelligence)** | PostgreSQL DDL/ETL feature store, R & Quarto, Python ML, Tableau LOD Storyboard | Google Data Analytics 6-phase lifecycle, Two-Way ANOVA & Tukey HSD, Multivariate OLS regression, Kaplan-Meier survival curves, 7-day burnout classifier, deload triggers. | Analytical Base Table (ABT)<br/>Quarto Publication Reports | Automated ETL & ML Pipeline |
| **[NextOmni Study](file:///c:/ezra-projects/nextomni/nextomni-study)** | Next.js 15, TypeScript 5.7, Tailwind CSS, Lucide React, Vitest, Web Audio API | FSRS-4.5 spaced repetition scheduler, dynamic university timetable matrix with conflict detection & RFC 5545 `.ics` export, syllabus AI decomposition, GPA scenario solver, procedural 40Hz binaural beats soundscape, and telemetry bridge. | `http://localhost:3001`<br/>[OpenAPI 3.1](http://localhost:3001/api/v1/openapi.json) | 22 Vitest Assertions (100% Passing) |

---

## 🎨 Unified Design System Tokens

Across all 4 modules, the NextOmni suite enforces a cohesive Dark Slate / Deep Obsidian aesthetic:

```css
:root {
  --color-obsidian-bg:      #080c14; /* Deep void background */
  --color-obsidian-card:    #0d131f; /* Card elevation */
  --color-obsidian-border:  #1e293b; /* Subtle structural borders */
  --color-emerald-accent:   #10b981; /* Financial alpha, high readiness */
  --color-indigo-neural:    #6366f1; /* Cognitive focus & AI compute */
  --color-cyan-glow:        #06b6d4; /* Real-time telemetry & metrics */
  --color-amber-warning:    #f59e0b; /* Deload triggers & tight transits */
}
```

---

## 🌐 100% Free-Tier Cloud Runbook ($0/month Forever)

The NextOmni suite achieves zero hosting overhead while upholding production ACID guarantees:

1. **Frontend Hosting (Edge)**: Vercel Free Hobby Tier / Netlify Edge (Global CDN, automatic SSL, pull-request preview domains).
2. **Backend Containers**: Render Free Web Services / Koyeb / Fly.io (512MB RAM Docker containers with OPcache bytecode compilation).
3. **Managed PostgreSQL**: Supabase / Neon Cloud PostgreSQL 16 (PgBouncer connection pooling on port 6543, 500MB free storage, zero idle costs).
4. **Queue Workers & Caching**: Database-backed queues (`QUEUE_CONNECTION=database`) and database cache (`CACHE_STORE=database`) eliminating the need for paid Redis clusters.

---

## 📜 Author & Engineering Ownership
Authored by **Ezra Lai** | Principal Systems Architect & Cognitive Engineer  
Portfolio: [https://github.com/ezralai](https://github.com/ezralai)
