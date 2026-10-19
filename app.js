/**
 * NextOmni Ecosystem Master Landing Page Client Logic
 * Author: Ezra Lai | Principal Systems Architect & Cognitive Engineer
 */

// ==============================================================================
// 1. Interactive Ambient Neural Canvas
// ==============================================================================
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, maxDist: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 100) * 0.15})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(16, 185, 129, ${(1 - dist / mouse.maxDist) * 0.25})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  render();
})();

// ==============================================================================
// 2. Procedural 40Hz Binaural Beats Web Audio Synthesis
// ==============================================================================
let audioCtx = null;
let oscLeft = null;
let oscRight = null;
let gainNode = null;
let isAudioPlaying = false;

function toggleSoundscape() {
  const topBtn = document.getElementById('soundscape-btn');
  const sandboxBtnText = document.getElementById('sandbox-audio-text');

  if (!isAudioPlaying) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Base Carrier 200Hz on Left, 240Hz on Right = 40Hz Gamma Differential
      const baseFreq = 200;
      const binauralBeat = 40;

      const merger = audioCtx.createChannelMerger(2);
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.2);

      oscLeft = audioCtx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);

      oscRight = audioCtx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(baseFreq + binauralBeat, audioCtx.currentTime);

      oscLeft.connect(merger, 0, 0);   // Left channel
      oscRight.connect(merger, 0, 1);  // Right channel
      merger.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscLeft.start();
      oscRight.start();
      isAudioPlaying = true;

      if (topBtn) topBtn.classList.add('active');
      if (sandboxBtnText) sandboxBtnText.textContent = 'Pause 40Hz Gamma Soundscape';
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  } else {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        try {
          oscLeft && oscLeft.stop();
          oscRight && oscRight.stop();
        } catch (e) {}
        isAudioPlaying = false;
        if (topBtn) topBtn.classList.remove('active');
        if (sandboxBtnText) sandboxBtnText.textContent = 'Play 40Hz Gamma Soundscape';
      }, 500);
    }
  }
}

document.getElementById('soundscape-btn')?.addEventListener('click', toggleSoundscape);

// ==============================================================================
// 3. Navbar Scroll Elevation & Mobile Menu Toggle
// ==============================================================================
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
if (mobileToggle && navMenu) {
  mobileToggle.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
  });
}

// ==============================================================================
// 4. Sandbox Tab Switcher
// ==============================================================================
function launchSandboxTab(tabName) {
  const tabs = document.querySelectorAll('.sandbox-tab-btn');
  const panels = document.querySelectorAll('.sandbox-panel');

  tabs.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  panels.forEach(panel => {
    if (panel.id === `sandbox-panel-${tabName}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  const sandboxElem = document.getElementById('sandbox');
  if (sandboxElem) {
    sandboxElem.scrollIntoView({ behavior: 'smooth' });
  }
}

document.querySelectorAll('.sandbox-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    launchSandboxTab(btn.dataset.tab);
  });
});

// ==============================================================================
// 5. Pillar 1: Life Habit & Circadian Engine
// ==============================================================================
function toggleHabitSandbox(id) {
  const check = id === 3 ? document.getElementById('habit-check-3') : null;
  const badge = id === 3 ? document.getElementById('habit-badge-3') : null;
  if (!check || !badge) return;

  const isActive = check.classList.contains('active');
  if (isActive) {
    check.classList.remove('active');
    check.textContent = '○';
    badge.textContent = '🔥 8d';
  } else {
    check.classList.add('active');
    check.textContent = '✓';
    badge.textContent = '🔥 9d';
  }
}

function updateCircadianClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const clockEl = document.getElementById('circadian-clock-time');
  if (clockEl) clockEl.textContent = timeString;

  // Calculate 24-hr dial angle
  const totalMinutes = hours * 60 + minutes;
  const degrees = (totalMinutes / 1440) * 360;
  const hand = document.getElementById('dial-hand');
  if (hand) hand.style.transform = `rotate(${degrees}deg)`;

  // Circadian stage mapping
  let phaseTitle = 'Optimal Phase';
  let phaseName = 'Daytime Focus';
  let phaseGuidance = 'Peak cognitive capacity.';
  let shortPhase = 'High Cognitive Readiness';

  if (hours >= 6 && hours < 9) {
    phaseTitle = 'Phase 1: Morning Light Exposure';
    phaseName = 'Cortisol Awakening Spike';
    phaseGuidance = 'View natural low-solar angle sunlight for 10-15 minutes to trigger the circadian clock and optimize nighttime melatonin timing.';
    shortPhase = 'Morning Cortisol Peak';
  } else if (hours >= 9 && hours < 13) {
    phaseTitle = 'Phase 1.5: Linear Analysis Window';
    phaseName = 'Max Prefrontal Neuro-Readiness';
    phaseGuidance = 'Dopamine and norepinephrine peak. Best window for complex distributed systems debugging, algorithmic review, and mathematics.';
    shortPhase = 'Peak Focus Window';
  } else if (hours >= 13 && hours < 16) {
    phaseTitle = 'Phase 2: Post-Prandial Dip';
    phaseName = 'Ultradian Autonomic Recovery';
    phaseGuidance = 'Core body temperature plateau. Ideal for light reading, routine code cleanup, or a 20-minute non-sleep deep rest (NSDR) protocol.';
    shortPhase = 'Autonomic Recovery';
  } else if (hours >= 16 && hours < 21) {
    phaseTitle = 'Phase 2.5: Physical & Second Focus';
    phaseName = 'Core Body Temp Peak';
    phaseGuidance = 'Physical training, creative architectural synthesis, and cross-module test verification.';
    shortPhase = 'Secondary Alertness';
  } else {
    phaseTitle = 'Phase 3: Recovery & Consolidation';
    phaseName = 'Deep Recovery & Melatonin Rise';
    phaseGuidance = 'Melatonin secretion active. Growth hormone release and memory consolidation in progress. Minimize blue photon exposure.';
    shortPhase = 'Rest & Recovery';
  }

  const badgeEl = document.getElementById('current-phase-badge');
  const titleEl = document.getElementById('current-phase-title');
  const descEl = document.getElementById('current-phase-guidance');
  const lifeText = document.getElementById('life-circadian-text');

  if (badgeEl) badgeEl.textContent = phaseTitle;
  if (titleEl) titleEl.textContent = phaseName;
  if (descEl) descEl.textContent = phaseGuidance;
  if (lifeText) lifeText.textContent = shortPhase;
}

setInterval(updateCircadianClock, 1000);
updateCircadianClock();

// ==============================================================================
// 6. Pillar 2: Study FSRS-4.5 Flashcard & What-If GPA Simulator
// ==============================================================================
function revealCardAnswer() {
  const ans = document.getElementById('card-answer');
  const revealBtn = document.getElementById('btn-reveal-answer');
  const gradeBtns = document.getElementById('fsrs-grade-buttons');

  if (ans) ans.classList.add('active');
  if (revealBtn) revealBtn.style.display = 'none';
  if (gradeBtns) gradeBtns.style.display = 'grid';
}

function gradeFSRS(grade) {
  const stabilityEl = document.getElementById('fsrs-stability');
  const retrievabilityEl = document.getElementById('fsrs-retrievability');

  if (grade === 'again') {
    if (stabilityEl) stabilityEl.textContent = '0.4 days';
    if (retrievabilityEl) retrievabilityEl.textContent = '65.0%';
  } else if (grade === 'hard') {
    if (stabilityEl) stabilityEl.textContent = '1.8 days';
    if (retrievabilityEl) retrievabilityEl.textContent = '84.2%';
  } else if (grade === 'good') {
    if (stabilityEl) stabilityEl.textContent = '4.5 days';
    if (retrievabilityEl) retrievabilityEl.textContent = '94.8%';
  } else if (grade === 'easy') {
    if (stabilityEl) stabilityEl.textContent = '9.2 days';
    if (retrievabilityEl) retrievabilityEl.textContent = '98.5%';
  }

  const ans = document.getElementById('card-answer');
  const revealBtn = document.getElementById('btn-reveal-answer');
  const gradeBtns = document.getElementById('fsrs-grade-buttons');

  setTimeout(() => {
    if (ans) ans.classList.remove('active');
    if (revealBtn) {
      revealBtn.style.display = 'block';
      revealBtn.textContent = 'Card Reviewed ✓ (Click to Reset)';
    }
    if (gradeBtns) gradeBtns.style.display = 'none';
  }, 350);
}

function recalcGPA() {
  const credits = parseFloat(document.getElementById('input-credits')?.value || 84);
  const semTarget = parseFloat(document.getElementById('input-sem-gpa')?.value || 4.0);

  const creditsEl = document.getElementById('credits-val');
  const semGpaEl = document.getElementById('sem-gpa-val');
  const finalEl = document.getElementById('final-gpa-val');

  if (creditsEl) creditsEl.textContent = `${credits} Credits`;
  if (semGpaEl) semGpaEl.textContent = semTarget.toFixed(2);

  // Baseline 3.88 over current credits + 18 credits upcoming
  const upcomingCredits = 18;
  const currentTotalGradePoints = 3.88 * credits;
  const upcomingTotalGradePoints = semTarget * upcomingCredits;
  const forecasted = (currentTotalGradePoints + upcomingTotalGradePoints) / (credits + upcomingCredits);

  if (finalEl) finalEl.textContent = forecasted.toFixed(2);
}

// ==============================================================================
// 7. Pillar 3: Finance BCMath & SHA-256 Digest Engine
// ==============================================================================
async function computeStatementHash() {
  const inputEl = document.getElementById('statement-input');
  const hashEl = document.getElementById('statement-hash-hex');
  if (!inputEl || !hashEl) return;

  const text = inputEl.value;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    hashEl.textContent = hashHex;
  } catch (err) {
    hashEl.textContent = 'Hash computation requires HTTPS or localhost';
  }
}
computeStatementHash();

// ==============================================================================
// 8. Pillar 4: Intelligence 7-Day Burnout Risk Classifier
// ==============================================================================
function predictBurnout() {
  const study = parseFloat(document.getElementById('input-ml-study')?.value || 7.5);
  const sleep = parseFloat(document.getElementById('input-ml-sleep')?.value || 7.2);
  const screen = parseFloat(document.getElementById('input-ml-screen')?.value || 1.0);
  const habit = parseFloat(document.getElementById('input-ml-habit')?.value || 90);

  document.getElementById('ml-study-val').textContent = `${study} hrs`;
  document.getElementById('ml-sleep-val').textContent = `${sleep} hrs`;
  document.getElementById('ml-screen-val').textContent = `${screen} hrs`;
  document.getElementById('ml-habit-val').textContent = `${habit}%`;

  // Empirical GBM Risk Proxy Formulation:
  // Base Risk + (Study Penalty) - (Sleep Protection) + (Late Screen Strain) - (Habit Resilience)
  let rawScore = 20;
  rawScore += (study - 6) * 6.5;
  rawScore -= (sleep - 6.5) * 11.0;
  rawScore += screen * 8.5;
  rawScore -= (habit - 70) * 0.25;

  let risk = Math.max(5, Math.min(95, rawScore));
  risk = Math.round(risk * 10) / 10;

  const percentEl = document.getElementById('burnout-percent');
  const gaugeFill = document.getElementById('gauge-meter-fill');
  const stateBox = document.getElementById('risk-state-box');
  const statusText = document.getElementById('risk-status-text');
  const recoText = document.getElementById('risk-recommendation-text');
  const dot = document.getElementById('risk-dot');

  if (percentEl) percentEl.textContent = `${risk}%`;

  let color = 'var(--color-emerald)';
  let status = 'Low Burnout Risk (Safe)';
  let reco = 'Optimal cognitive equilibrium detected. Maintain current 90-minute ultradian study blocks and current sleep schedule.';
  let bgBox = 'rgba(16, 185, 129, 0.08)';
  let borderBox = 'rgba(16, 185, 129, 0.25)';

  if (risk > 65) {
    color = '#f43f5e';
    status = 'HIGH BURNOUT HAZARD (DELOAD TRIGGERED)';
    reco = 'Critical neuro-fatigue signature! System has automatically triggered a 48-hour deload recommendation: cap study at 3.5 hrs and restrict post-10 PM screens.';
    bgBox = 'rgba(244, 63, 94, 0.12)';
    borderBox = 'rgba(244, 63, 94, 0.4)';
  } else if (risk > 40) {
    color = '#f59e0b';
    status = 'Moderate Strain (Caution)';
    reco = 'Accumulating debt detected. Shift study intervals to lower intensity and ensure 8+ hours sleep tonight.';
    bgBox = 'rgba(245, 158, 11, 0.1)';
    borderBox = 'rgba(245, 158, 11, 0.35)';
  }

  if (gaugeFill) {
    gaugeFill.style.background = `conic-gradient(${color} 0% ${risk}%, rgba(255, 255, 255, 0.08) ${risk}% 100%)`;
  }
  if (stateBox) {
    stateBox.style.background = bgBox;
    stateBox.style.borderColor = borderBox;
  }
  if (statusText) {
    statusText.textContent = status;
    statusText.style.color = color;
  }
  if (dot) dot.style.background = color;
  if (recoText) recoText.textContent = reco;
}

// ==============================================================================
// 9. Interactive Architecture Diagram Node Inspector
// ==============================================================================
const archNodesData = {
  'edge-fin': {
    title: 'NextOmni Finance Web (Nuxt 3 & Vue 3)',
    desc: 'Frontend edge web surface deployed on Vercel Global Edge CDN. Communicates via authenticated REST and Bearer token headers to the Laravel 11 gateway.',
    meta: ['Edge Cold Start: < 80ms', 'Framework: Nuxt 3.12 / Pinia', 'Hosting: Vercel Edge ($0/mo)']
  },
  'edge-life': {
    title: 'NextOmni Life Web (Next.js 15 App Router)',
    desc: 'PWA-ready reactive web client featuring 365-day SVG streaks, Web Audio 40Hz acoustic focus synthesis, and real-time circadian timeline rendering.',
    meta: ['Framework: React 19 / Next.js 15', 'Port: localhost:3000', 'Cache: LocalStorage & Offline ServiceWorker']
  },
  'edge-study': {
    title: 'NextOmni Study Web (FSRS Spaced Repetition)',
    desc: 'Academic mastery client with real-time university timetable grid matrix, course syllabus AI decomposition, and sensitivity-modeled CGPA calculators.',
    meta: ['Framework: Next.js 15 / Tailwind', 'Port: localhost:3001', 'Test Coverage: 22 Vitest Assertions Passing']
  },
  'gateway-fin': {
    title: 'Finance REST API Gateway (Laravel 11 & PHP 8.3)',
    desc: 'High-performance microservice executing BCMath arbitrary-precision arithmetic, non-custodial Malaysian bank statement parsers, and SHA-256 deduplication.',
    meta: ['API Standard: OpenAPI 3.1 & Scalar', 'Test Assertions: 66 Tests / 550 Assertions', 'Bytecode: Zend OPcache Compiled']
  },
  'gateway-life': {
    title: 'Life AI Engine (FastAPI & Python 3.14)',
    desc: 'Lightweight asynchronous AI engine running evening CBT debrief sentiment classification and natural language habit query decomposition.',
    meta: ['Server: Uvicorn Asynchronous ASGI', 'Port: localhost:8000', 'Endpoints: /api/v1/debrief, /health']
  },
  'gateway-study': {
    title: 'Study Engine & Matrix Solver (Next.js Serverless)',
    desc: 'Algorithmic route handlers calculating FSRS-4.5 interval matrices, conflict resolution algorithms for university timetables, and RFC 5545 .ics generation.',
    meta: ['Scheduler: FSRS-4.5 Mathematical Core', 'Format: RFC 5545 iCalendar', 'Contract: OpenAPI 3.1 Compliant']
  },
  'db-fin': {
    title: 'finance_ledger (Supabase PostgreSQL 16)',
    desc: 'ACID-compliant financial ledger utilizing UUIDv7 sequential primary keys for maximum B-tree indexing efficiency and NUMERIC(15,4) precision columns.',
    meta: ['Primary Keys: UUIDv7', 'Col Precision: NUMERIC(15,4)', 'Pooler: PgBouncer Port 6543']
  },
  'db-life': {
    title: 'life_os Persistence (Neon Cloud PostgreSQL)',
    desc: 'Relational data store managed via Prisma ORM client. Stores circadian energy timeline snapshots, 365-day habit compliance, and focus logs.',
    meta: ['ORM: Prisma Client 5.x', 'Driver: Neon Serverless PgBouncer', 'Idle Cost: $0.00/mo']
  },
  'db-telemetry': {
    title: 'nextomni_telemetry (Master Feature Store)',
    desc: 'Centralized Analytical Base Table (ABT) ingesting real-time operational telemetry across focus sessions, study reviews, and habit completions for causal analysis.',
    meta: ['Ingestion: Real-time ACID Stream', 'Target: R & Python ML Pipelines', 'Status: Active Continuous Flow']
  },
  'ml-r': {
    title: 'R & Quarto Causal Analytics Engine',
    desc: 'Executes Two-Way ANOVA & Tukey HSD post-hoc hypothesis tests, multivariate OLS flow regression, and Kaplan-Meier habit survival decay modeling.',
    meta: ['Language: R 4.4 / Quarto CLI', 'Statistics: ANOVA, Tukey HSD, OLS', 'Artifacts: Automated HTML / PDF Reports']
  },
  'ml-py': {
    title: 'Python Machine Learning (Scikit-Learn GBM)',
    desc: '7-day cognitive burnout probability classifier trained on historical telemetry to trigger early closed-loop deload warnings back to NextOmni Life.',
    meta: ['Model: Gradient Boosting Classifier', 'Accuracy: 94.2% Validation Score', 'Response Time: < 15ms']
  },
  'ml-tab': {
    title: 'Tableau Executive LOD Storyboard',
    desc: 'Level-of-Detail (LOD) executive dashboard providing an overarching radar clock of daily focus, academic progress, and net-worth trajectories.',
    meta: ['Visualization: Tableau Public / Cloud', 'Type: Dynamic LOD Radar Clock', 'Audience: Recruiter & Executive Review']
  }
};

document.querySelectorAll('.node-clickable').forEach(node => {
  node.addEventListener('click', () => {
    document.querySelectorAll('.node-clickable').forEach(n => n.classList.remove('selected'));
    node.classList.add('selected');

    const key = node.dataset.node;
    const data = archNodesData[key];
    if (data) {
      document.getElementById('inspector-title').textContent = data.title;
      document.getElementById('inspector-desc').textContent = data.desc;
      const metaContainer = document.getElementById('inspector-meta');
      if (metaContainer) {
        metaContainer.innerHTML = data.meta.map(m => `<span class="meta-item"><strong>•</strong> ${m}</span>`).join('');
      }
    }
  });
});

// ==============================================================================
// 10. Master Ecosystem PowerShell Terminal Simulation
// ==============================================================================
const terminalScreen = document.getElementById('terminal-screen');
const terminalInput = document.getElementById('terminal-input');

function appendTerminalLine(text, className = '') {
  if (!terminalScreen) return;
  const line = document.createElement('div');
  line.className = `terminal-line ${className}`;
  line.innerHTML = text;
  terminalScreen.appendChild(line);
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function clearTerminal() {
  if (terminalScreen) {
    terminalScreen.innerHTML = `
      <div class="terminal-line banner-line">
+------------------------------------------------------------------------------+<br/>
|                       NEXTOMNI ECOSYSTEM MASTER CLI                          |<br/>
|     Flagship Personal Life, Financial, Academic & Intelligence OS            |<br/>
|     Authored by Ezra Lai | 100% Free-Tier Production Cloud ($0/mo)           |<br/>
+------------------------------------------------------------------------------+
      </div>
      <div class="terminal-line info-line">[+] Terminal cleared. Ready for commands.</div>
    `;
  }
}

function executeCLICommand(cmd) {
  cmd = (cmd || '').trim().toLowerCase();
  appendTerminalLine(`PS C:\\ezra-projects\\nextomni&gt; .\\run_ecosystem.ps1 ${cmd}`, 'cmd-line');

  if (cmd === 'status' || cmd === '-status') {
    appendTerminalLine('[+] Ecosystem Health & Pillar Status Review:', 'success-line');
    appendTerminalLine('  [OK] NextOmni Finance       -&gt; Laravel 11 REST | Nuxt 3 | Postgres 16 UUIDv7 | Scalar');
    appendTerminalLine('  [OK] NextOmni Life          -&gt; Next.js 15 | React 19 | FastAPI Python 3.14 | Prisma | Web Audio');
    appendTerminalLine('  [OK] NextOmni Intelligence  -&gt; PostgreSQL Feature Store | R and Quarto | Python ML | Tableau');
    appendTerminalLine('  [OK] NextOmni Study         -&gt; Next.js 15 | FSRS-4.5 | Timetable Matrix | Syllabus AI | GPA Engine');
    appendTerminalLine('  [OK] Master Landing Portal  -&gt; 4/4 Modules Online | $0/mo Cloud Topology Verified', 'success-line');
  } else if (cmd === 'test-all' || cmd === '-testall' || cmd === 'test') {
    appendTerminalLine('==========================================================================', 'info-line');
    appendTerminalLine(' EXECUTING MULTI-MODULE TEST & VERIFICATION SUITE', 'info-line');
    appendTerminalLine('==========================================================================', 'info-line');
    appendTerminalLine(' [*] NextOmni Study (Vitest 22 Assertions: FSRS, Timetable, GPA, Telemetry)');
    appendTerminalLine('     ✓ test/fsrs_matrix.test.ts (8 tests)');
    appendTerminalLine('     ✓ test/timetable_conflict.test.ts (6 tests)');
    appendTerminalLine('     ✓ test/gpa_engine.test.ts (8 tests)');
    appendTerminalLine('     [OK] NextOmni Study: 22/22 Unit Test Assertions Passed', 'success-line');
    appendTerminalLine(' [*] NextOmni Intelligence (FastAPI Regression Suite and Burnout Classifier)');
    appendTerminalLine('     ✓ tests/test_fastapi_burnout.py (5 tests)');
    appendTerminalLine('     [OK] NextOmni Intelligence: 5/5 FastAPI and ML Tests Passed', 'success-line');
    appendTerminalLine(' [*] NextOmni Life (FastAPI AI Engine Router and Debrief Synthesis)');
    appendTerminalLine('     ✓ apps/ai-engine/tests/test_life_router.py (3 tests)');
    appendTerminalLine('     [OK] NextOmni Life: 3/3 AI Engine Tests Passed', 'success-line');
    appendTerminalLine(' [*] NextOmni Finance (Pest PHP 8.3 & BCMath Arbitrary Precision)');
    appendTerminalLine('     ✓ tests/Feature/LedgerDeduplicationTest.php (66 tests / 550 assertions)');
    appendTerminalLine('     [OK] NextOmni Finance: 66/66 Pest Tests Passed', 'success-line');
    appendTerminalLine('==========================================================================', 'success-line');
    appendTerminalLine(' ALL REPOSITORIES IN NEXTOMNI ECOSYSTEM VERIFIED WITH 0 FAILURES', 'success-line');
  } else if (cmd === 'verify-all' || cmd === '-verifyall') {
    appendTerminalLine('[*] Verifying TypeScript schemas, database migrations, and OpenAPI 3.1 contracts...');
    appendTerminalLine('  [OK] nextomni-study: TypeScript 5.7 tsc --noEmit (0 errors)', 'success-line');
    appendTerminalLine('  [OK] nextomni-life: Prisma Schema Sync (Valid)', 'success-line');
    appendTerminalLine('  [OK] nextomni-finance: OpenAPI 3.1 Schema & Scalar (Valid)', 'success-line');
    appendTerminalLine('  [OK] nextomni-intelligence: Analytical Base Table DDL (Valid)', 'success-line');
    appendTerminalLine('[+] 100% Schema & Type Consistency Verified across entire portfolio.', 'success-line');
  } else if (cmd === 'serve-study' || cmd === '-servestudy') {
    appendTerminalLine('[*] NextOmni Study: Next.js 15 App Router starting on http://localhost:3001');
    appendTerminalLine('  ▲ Next.js 15.1.0 - Local: http://localhost:3001', 'success-line');
    appendTerminalLine('  ✓ Ready in 1.4s (Ready to accept traffic)');
  } else if (cmd === 'serve-life' || cmd === '-servelife') {
    appendTerminalLine('[*] NextOmni Life: Next.js 15 Web App starting on http://localhost:3000');
    appendTerminalLine('  ▲ Next.js 15.1.0 - Local: http://localhost:3000', 'success-line');
    appendTerminalLine('  ✓ Ready in 1.6s (Ready to accept traffic)');
  } else if (cmd === 'serve-intel' || cmd === '-serveintelligence') {
    appendTerminalLine('[*] NextOmni Intelligence: FastAPI Uvicorn ASGI on http://localhost:8000');
    appendTerminalLine('  INFO: Uvicorn running on http://localhost:8000 (Press CTRL+C to quit)', 'success-line');
    appendTerminalLine('  INFO: Application startup complete. Swagger docs at http://localhost:8000/docs');
  } else if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
    appendTerminalLine('Available Ecosystem Commands:');
    appendTerminalLine('  status           - View active status of all 4 pillars');
    appendTerminalLine('  test-all         - Run Vitest, Pest, and Python ML test suites');
    appendTerminalLine('  verify-all       - Verify TypeScript types, Prisma DDL, and API schemas');
    appendTerminalLine('  serve-life       - Spin up NextOmni Life on :3000');
    appendTerminalLine('  serve-study      - Spin up NextOmni Study on :3001');
    appendTerminalLine('  serve-intel      - Spin up NextOmni Intelligence on :8000');
    appendTerminalLine('  clear            - Clear terminal screen');
  } else if (cmd === 'clear') {
    clearTerminal();
  } else {
    appendTerminalLine(`[!] Unrecognized command: "${cmd}". Type "help" or click quick action buttons.`, 'error-line');
  }
}

function handleTerminalSubmit(e) {
  e.preventDefault();
  if (!terminalInput) return;
  const val = terminalInput.value;
  if (!val.trim()) return;
  executeCLICommand(val);
  terminalInput.value = '';
}
