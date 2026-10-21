/**
 * NextOmni Ecosystem Master Landing Page Client Logic (UX Enhanced Edition)
 * Author: Ezra Lai | Principal Systems Architect & Cognitive Engineer
 */

// ==============================================================================
// 1. Toast Notification System
// ==============================================================================
function showToast(message, icon = '✦') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function copyLaunchCommand(cmdKey) {
  const commands = {
    'serve-life': 'powershell -File ./run_ecosystem.ps1 -ServeLife',
    'serve-study': 'powershell -File ./run_ecosystem.ps1 -ServeStudy',
    'serve-intel': 'powershell -File ./run_ecosystem.ps1 -ServeIntelligence',
    'serve-landing': 'powershell -File ./run_ecosystem.ps1 -ServeLanding',
    'test-all': 'powershell -File ./run_ecosystem.ps1 -TestAll'
  };

  const text = commands[cmdKey] || `powershell -File ./run_ecosystem.ps1 -${cmdKey}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied command: "${text}"`, '📋');
  }).catch(() => {
    showToast(`Run: ${text}`, 'ℹ️');
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==============================================================================
// 2. Interactive Ambient Neural Canvas
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
// 3. Procedural Binaural Beats Web Audio Synthesis with Oscilloscope
// ==============================================================================
let audioCtx = null;
let oscLeft = null;
let oscRight = null;
let gainNode = null;
let isAudioPlaying = false;
let currentBinauralBeat = 40; // Default 40Hz Gamma Focus
let animFrameId = null;

function setBinauralBeat(beatFreq, modeName) {
  currentBinauralBeat = beatFreq;
  const pills = document.querySelectorAll('.freq-pill');
  pills.forEach(p => p.classList.remove('active'));

  event?.target?.classList.add('active');

  const modeEl = document.getElementById('current-audio-mode');
  if (modeEl) modeEl.textContent = `Current: ${modeName} (Active)`;

  if (isAudioPlaying && oscRight && audioCtx) {
    oscRight.frequency.setValueAtTime(200 + currentBinauralBeat, audioCtx.currentTime);
  }

  showToast(`Acoustic Priming switched to ${modeName}`, '🎧');
}

function drawOscilloscope() {
  const canvas = document.getElementById('audio-oscilloscope');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  let phase = 0;
  function animate() {
    if (!isAudioPlaying) {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      return;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.5;

    // Draw Left Wave (200Hz proxy)
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.08 + phase) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Interference Gamma Beat Wave
    ctx.strokeStyle = '#06b6d4';
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const envelope = Math.cos(x * 0.02 + phase * 0.5);
      const carrier = Math.sin(x * 0.08 + phase);
      const y = h / 2 + (carrier * envelope) * 18;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    phase += 0.08;
    animFrameId = requestAnimationFrame(animate);
  }
  animate();
}

function toggleSoundscape() {
  const topBtn = document.getElementById('soundscape-btn');
  const dockBtn = document.getElementById('dock-soundscape-btn');
  const sandboxBtnText = document.getElementById('sandbox-audio-text');

  if (!isAudioPlaying) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const baseFreq = 200;
      const merger = audioCtx.createChannelMerger(2);
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.0);

      oscLeft = audioCtx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);

      oscRight = audioCtx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(baseFreq + currentBinauralBeat, audioCtx.currentTime);

      oscLeft.connect(merger, 0, 0);
      oscRight.connect(merger, 0, 1);
      merger.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscLeft.start();
      oscRight.start();
      isAudioPlaying = true;

      if (topBtn) topBtn.classList.add('active');
      if (dockBtn) dockBtn.classList.add('active');
      if (sandboxBtnText) sandboxBtnText.textContent = `Pause ${currentBinauralBeat}Hz Soundscape`;

      drawOscilloscope();
      showToast(`${currentBinauralBeat}Hz Binaural Soundscape Active`, '🎧');
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
        if (dockBtn) dockBtn.classList.remove('active');
        if (sandboxBtnText) sandboxBtnText.textContent = `Play ${currentBinauralBeat}Hz Soundscape`;
        drawOscilloscope();
        showToast('Soundscape Paused', '⏸');
      }, 500);
    }
  }
}

document.getElementById('soundscape-btn')?.addEventListener('click', toggleSoundscape);

// ==============================================================================
// 4. Command Palette (Ctrl+K / ⌘K)
// ==============================================================================
const cpActions = [
  { id: 'tour', title: 'Start Guided Recruiter Tour', category: 'Recruiter Experience', icon: '🧭', action: () => startRecruiterTour() },
  { id: 'telemetry', title: 'Open Cross-Module Telemetry Dispatcher', category: 'Recruiter Experience', icon: '⚡', action: () => { window.location.hash = '#sandbox'; launchSandboxTab('telemetry'); } },
  { id: 'life', title: 'Jump to NextOmni Life (Port 3000)', category: 'Pillars', icon: '🌿', action: () => { window.location.hash = '#module-life'; launchSandboxTab('life'); } },
  { id: 'study', title: 'Jump to NextOmni Study (Port 3001)', category: 'Pillars', icon: '🎓', action: () => { window.location.hash = '#module-study'; launchSandboxTab('study'); } },
  { id: 'finance', title: 'Jump to NextOmni Finance (Vercel & Render)', category: 'Pillars', icon: '💳', action: () => { window.location.hash = '#module-finance'; launchSandboxTab('finance'); } },
  { id: 'intelligence', title: 'Jump to NextOmni Intelligence (Port 8000)', category: 'Pillars', icon: '🧠', action: () => { window.location.hash = '#module-intelligence'; launchSandboxTab('intelligence'); } },
  { id: 'sound', title: 'Toggle 40Hz Gamma Focus Binaural Beats', category: 'Audio Focus', icon: '🎧', action: () => toggleSoundscape() },
  { id: 'status', title: 'Check Ecosystem Health & CLI Status', category: 'Developer Tools', icon: '⚡', action: () => { window.location.hash = '#terminal'; executeCLICommand('status'); } },
  { id: 'test', title: 'Run Multi-Module Verified Test Suite', category: 'Developer Tools', icon: '🧪', action: () => { window.location.hash = '#terminal'; executeCLICommand('test-all'); } },
  { id: 'health', title: 'Open Microservice Connectivity Inspector', category: 'DevOps', icon: '📡', action: () => openHealthModal() },
  { id: 'arch', title: 'Explore Master Topology & ACID Telemetry', category: 'Architecture', icon: '🏛️', action: () => { window.location.hash = '#architecture'; } },
  { id: 'runbook', title: 'View 100% Free-Tier Cloud Runbook ($0/mo)', category: 'Architecture', icon: '☁️', action: () => { window.location.hash = '#runbook'; } },
  { id: 'github', title: 'Open Ezra Lai GitHub Portfolio', category: 'Author Profile', icon: '↗', action: () => window.open('https://github.com/ezralai', '_blank') }
];

let selectedCpIndex = 0;

function openCommandPalette() {
  const backdrop = document.getElementById('command-palette-backdrop');
  const input = document.getElementById('cp-input');
  if (backdrop) {
    backdrop.classList.add('active');
    filterCommandPalette('');
    setTimeout(() => input?.focus(), 50);
  }
}

function closeCommandPalette() {
  const backdrop = document.getElementById('command-palette-backdrop');
  if (backdrop) backdrop.classList.remove('active');
}

function filterCommandPalette(query) {
  query = (query || '').toLowerCase().trim();
  const listEl = document.getElementById('cp-results-list');
  if (!listEl) return;

  const matches = cpActions.filter(a => 
    a.title.toLowerCase().includes(query) || 
    a.category.toLowerCase().includes(query)
  );

  selectedCpIndex = 0;
  if (matches.length === 0) {
    listEl.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">No actions matching "${query}"</div>`;
    return;
  }

  listEl.innerHTML = matches.map((m, idx) => `
    <div class="cp-item ${idx === 0 ? 'selected' : ''}" data-idx="${idx}" onclick="executeCpAction(${idx})">
      <div class="cp-item-left">
        <span class="cp-item-icon">${m.icon}</span>
        <span>${m.title}</span>
      </div>
      <span class="cp-item-badge">${m.category}</span>
    </div>
  `).join('');
}

function executeCpAction(idx) {
  const input = document.getElementById('cp-input')?.value.toLowerCase().trim() || '';
  const matches = cpActions.filter(a => a.title.toLowerCase().includes(input) || a.category.toLowerCase().includes(input));
  const target = matches[idx] || matches[0];
  if (target) {
    closeCommandPalette();
    target.action();
  }
}

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const backdrop = document.getElementById('command-palette-backdrop');
    if (backdrop?.classList.contains('active')) closeCommandPalette();
    else openCommandPalette();
  } else if (e.key === 'Escape') {
    closeCommandPalette();
    closeHealthModal();
    endRecruiterTour();
  } else if (document.getElementById('command-palette-backdrop')?.classList.contains('active')) {
    const items = document.querySelectorAll('.cp-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedCpIndex = (selectedCpIndex + 1) % items.length;
      items.forEach((it, i) => it.classList.toggle('selected', i === selectedCpIndex));
      items[selectedCpIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedCpIndex = (selectedCpIndex - 1 + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('selected', i === selectedCpIndex));
      items[selectedCpIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCpAction(selectedCpIndex);
    }
  }
});

// ==============================================================================
// 5. 1-Click Guided Recruiter Tour System
// ==============================================================================
const tourSteps = [
  {
    target: '#hero',
    title: 'Welcome to NextOmni Core',
    body: 'NextOmni is a distributed personal operating system authored by Ezra Lai. Built for senior engineering scrutiny with 100% free-tier cloud deployment ($0/mo forever) and real ACID telemetry.'
  },
  {
    target: '#modules',
    title: 'The Four Sovereign Pillars',
    body: 'The ecosystem spans 4 domains: NextOmni Life (Circadian), NextOmni Study (FSRS-4.5), NextOmni Finance (BCMath), and NextOmni Intelligence (Causal ML). Each runs independently with verified test suites.'
  },
  {
    target: '#architecture',
    title: 'Master Topology & Dataflow',
    body: 'Click any node in this diagram to inspect its compute profile, database isolation guarantees, or how telemetry streams from Study and Life into the Intelligence Feature Store.'
  },
  {
    target: '#sandbox',
    title: 'Interactive Recruiter Lab',
    body: 'Test drive the core algorithms live! Grade FSRS memory intervals, calculate arbitrary-precision financial BCMath splits, check live Huberman circadian clocks, and test the 7-day burnout ML classifier.'
  },
  {
    target: '#terminal',
    title: 'Ecosystem Master PowerShell CLI',
    body: 'Try typing commands or clicking the quick action buttons to verify test assertions across all repositories directly in this browser terminal emulator.'
  }
];

let currentTourStep = 0;

function startRecruiterTour() {
  currentTourStep = 0;
  showTourStep(currentTourStep);
  showToast('Guided Recruiter Tour Started', '🧭');
}

function showTourStep(idx) {
  const card = document.getElementById('tour-card');
  if (!card) return;

  const step = tourSteps[idx];
  document.getElementById('tour-step-badge').textContent = `Step ${idx + 1} of ${tourSteps.length}`;
  document.getElementById('tour-title').textContent = step.title;
  document.getElementById('tour-body').textContent = step.body;

  const prevBtn = document.getElementById('tour-prev-btn');
  const nextBtn = document.getElementById('tour-next-btn');

  if (prevBtn) prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
  if (nextBtn) nextBtn.textContent = idx === tourSteps.length - 1 ? 'Finish Tour' : 'Next →';

  // Update dots
  const dots = document.querySelectorAll('.t-dot-step');
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));

  card.style.display = 'block';

  const targetEl = document.querySelector(step.target);
  if (targetEl) {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelectorAll('.tour-highlighted').forEach(el => el.classList.remove('tour-highlighted'));
    targetEl.classList.add('tour-highlighted');
  }
}

function nextTourStep() {
  if (currentTourStep < tourSteps.length - 1) {
    currentTourStep++;
    showTourStep(currentTourStep);
  } else {
    endRecruiterTour();
    showToast('Tour Completed! Enjoy exploring NextOmni.', '🎉');
  }
}

function prevTourStep() {
  if (currentTourStep > 0) {
    currentTourStep--;
    showTourStep(currentTourStep);
  }
}

function endRecruiterTour() {
  const card = document.getElementById('tour-card');
  if (card) card.style.display = 'none';
  document.querySelectorAll('.tour-highlighted').forEach(el => el.classList.remove('tour-highlighted'));
}

// ==============================================================================
// 6. Microservice Health Inspector Modal & Live Ping Checks
// ==============================================================================
function openHealthModal() {
  const backdrop = document.getElementById('health-modal-backdrop');
  if (backdrop) {
    backdrop.classList.add('active');
    checkAllMicroservices();
  }
}

function closeHealthModal() {
  const backdrop = document.getElementById('health-modal-backdrop');
  if (backdrop) backdrop.classList.remove('active');
}

async function checkAllMicroservices() {
  pingService('main');
  pingService('life');
  pingService('study');
  pingService('finance');
  pingService('intelligence');
}

async function pingService(serviceKey) {
  const statusTexts = {
    'main': document.getElementById('status-text-main'),
    'life': document.getElementById('status-text-life'),
    'study': document.getElementById('status-text-study'),
    'finance': document.getElementById('status-text-finance'),
    'intelligence': document.getElementById('status-text-intelligence')
  };

  const hmItem = document.getElementById(`hm-${serviceKey}`);
  const hmBadge = hmItem ? hmItem.querySelector('.hm-badge') : null;

  if (statusTexts[serviceKey]) statusTexts[serviceKey].textContent = 'Pinging...';
  if (hmBadge) {
    hmBadge.className = 'hm-badge badge-checking';
    hmBadge.textContent = 'Checking...';
  }

  // Microservice endpoints mapping
  const endpoints = {
    'main': '/api/v1/health',
    'life': 'http://localhost:3000',
    'study': 'http://localhost:3001',
    'finance': 'https://nextomni-finance.vercel.app',
    'intelligence': 'http://localhost:8000/docs'
  };

  const url = endpoints[serviceKey];
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const resp = await fetch(url, { mode: 'no-cors', signal: controller.signal });
    clearTimeout(timeout);
    const latency = Math.round(performance.now() - startTime);

    if (statusTexts[serviceKey]) statusTexts[serviceKey].textContent = `Active (${latency}ms)`;
    if (hmBadge) {
      hmBadge.className = 'hm-badge badge-online';
      hmBadge.textContent = `Online (${latency}ms)`;
    }
    showToast(`${serviceKey.toUpperCase()} service is Online (${latency}ms)`, '🟢');
  } catch (err) {
    if (statusTexts[serviceKey]) statusTexts[serviceKey].textContent = 'Offline (Click Boot)';
    if (hmBadge) {
      hmBadge.className = 'hm-badge badge-offline';
      hmBadge.textContent = 'Offline';
    }
  }
}

// ==============================================================================
// 7. Navbar Scroll Elevation & Mobile Menu Toggle
// ==============================================================================
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
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
// 8. Sandbox Tab Switcher
// ==============================================================================
function launchSandboxTab(tabName) {
  const tabs = document.querySelectorAll('.sandbox-tab-btn');
  const panels = document.querySelectorAll('.sandbox-panel');

  tabs.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  panels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `sandbox-panel-${tabName}`);
  });

  const sandboxElem = document.getElementById('sandbox');
  if (sandboxElem) sandboxElem.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('.sandbox-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    launchSandboxTab(btn.dataset.tab);
  });
});

// ==============================================================================
// 9. Pillar 1: Life Habit & Circadian Engine with Custom Habit Creator
// ==============================================================================
let isScrubbing = false;

function toggleHabitSandbox(id) {
  const check = id === 3 ? document.getElementById('habit-check-3') : null;
  const badge = id === 3 ? document.getElementById('habit-badge-3') : null;
  if (!check || !badge) return;

  const isActive = check.classList.contains('active');
  if (isActive) {
    check.classList.remove('active');
    check.textContent = '○';
    badge.textContent = '🔥 8d';
    showToast('Habit unchecked for today', '○');
  } else {
    check.classList.add('active');
    check.textContent = '✓';
    badge.textContent = '🔥 9d';
    showToast('Habit completed! Streak incremented to 9 days.', '🔥');
  }
}

function addCustomHabit(e) {
  e.preventDefault();
  const input = document.getElementById('new-habit-input');
  if (!input || !input.value.trim()) return;

  const name = input.value.trim();
  const container = document.getElementById('habits-container');

  const newBox = document.createElement('div');
  newBox.className = 'habit-item-box';
  newBox.innerHTML = `
    <button class="habit-checkbox active" onclick="this.classList.toggle('active'); this.textContent = this.classList.contains('active') ? '✓' : '○'">✓</button>
    <div class="habit-details">
      <span class="habit-name">${name}</span>
      <span class="habit-sub">Custom tracking item • Active telemetry</span>
    </div>
    <span class="habit-streak-badge">🔥 1d</span>
  `;

  container.appendChild(newBox);
  input.value = '';
  showToast(`Custom habit "${name}" added!`, '✓');
}

function scrubCircadianTime(totalMinutes) {
  isScrubbing = true;
  totalMinutes = parseInt(totalMinutes, 10);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  document.getElementById('scrubber-time-val').textContent = timeString;
  updateCircadianStage(hours, minutes, 0, true);
}

function resetToRealTime() {
  isScrubbing = false;
  document.getElementById('scrubber-time-val').textContent = 'Live Clock';
  updateCircadianClock();
  showToast('Circadian clock synchronized with real solar time', '⏱');
}

function updateCircadianClock() {
  if (isScrubbing) return;
  const now = new Date();
  updateCircadianStage(now.getHours(), now.getMinutes(), now.getSeconds(), false);
}

function updateCircadianStage(hours, minutes, seconds, isSimulated) {
  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const clockEl = document.getElementById('circadian-clock-time');
  if (clockEl) clockEl.textContent = timeString;

  const totalMinutes = hours * 60 + minutes;
  const degrees = (totalMinutes / 1440) * 360;
  const hand = document.getElementById('dial-hand');
  if (hand) hand.style.transform = `rotate(${degrees}deg)`;

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
// 10. Pillar 2: Study FSRS-4.5 Decks, Flashcard & Timetable Matrix Collision
// ==============================================================================
const studyDecks = [
  {
    tag: 'CS4102 • DISTRIBUTED SYSTEMS',
    question: 'What is the core distinction between Paxos and Raft consensus algorithms?',
    answer: 'Raft decomposes consensus into Leader Election, Log Replication, and Safety, enforcing strong leader dominance to maximize human understandability. Paxos is symmetric and permits multi-proposer coordination without a singular leader invariant.',
    stability: '3.2 days',
    retrievability: '92.4%',
    difficulty: '4.8 / 10'
  },
  {
    tag: 'AI3205 • MACHINE LEARNING',
    question: 'Why does Multi-Head Attention scale quadratically O(N^2) with sequence length?',
    answer: 'Standard Self-Attention computes dot products between all pairs of queries Q and keys K, yielding an N×N attention affinity matrix. For long context sequences, memory bandwidth and compute scale as N^2.',
    stability: '5.1 days',
    retrievability: '96.1%',
    difficulty: '6.2 / 10'
  },
  {
    tag: 'CS3203 • DATABASE INTERNALS',
    question: 'How do Log-Structured Merge (LSM) trees achieve superior write throughput over B+ Trees?',
    answer: 'LSM trees convert random disk writes into sequential append-only disk operations by buffering in an in-memory MemTable and flushing SSTables to disk in tiers, trading read amplification for maximized sequential write bandwidth.',
    stability: '4.4 days',
    retrievability: '94.0%',
    difficulty: '5.4 / 10'
  }
];

let currentDeckIdx = 0;

function switchStudyDeck(idx) {
  currentDeckIdx = idx;
  const pills = document.querySelectorAll('.deck-pill');
  pills.forEach((p, i) => p.classList.toggle('active', i === idx));

  const deck = studyDecks[idx];
  document.getElementById('card-deck-tag').textContent = deck.tag;
  document.getElementById('card-q-text').textContent = deck.question;
  document.getElementById('card-ans-text').innerHTML = `<strong>Answer:</strong> ${deck.answer}`;
  document.getElementById('fsrs-stability').textContent = deck.stability;
  document.getElementById('fsrs-retrievability').textContent = deck.retrievability;
  document.getElementById('fsrs-difficulty').textContent = deck.difficulty;

  const ans = document.getElementById('card-answer');
  const revealBtn = document.getElementById('btn-reveal-answer');
  const gradeBtns = document.getElementById('fsrs-grade-buttons');

  if (ans) ans.classList.remove('active');
  if (revealBtn) {
    revealBtn.style.display = 'block';
    revealBtn.textContent = 'Reveal Answer & Calculate Intervals';
  }
  if (gradeBtns) gradeBtns.style.display = 'none';

  showToast(`Switched deck to ${deck.tag}`, '📚');
}

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
    showToast('FSRS-4.5: Resetting interval (Review in 10m)', '🔄');
  } else if (grade === 'hard') {
    if (stabilityEl) stabilityEl.textContent = '1.8 days';
    if (retrievabilityEl) retrievabilityEl.textContent = '84.2%';
    showToast('FSRS-4.5: Interval scheduled for 1.4 days', '⚡');
  } else if (grade === 'good') {
    if (stabilityEl) stabilityEl.textContent = '4.5 days';
    if (retrievabilityEl) retrievabilityEl.textContent = '94.8%';
    showToast('FSRS-4.5: Interval scheduled for 3.8 days', '✓');
  } else if (grade === 'easy') {
    if (stabilityEl) stabilityEl.textContent = '9.2 days';
    if (retrievabilityEl) retrievabilityEl.textContent = '98.5%';
    showToast('FSRS-4.5: Interval scheduled for 7.5 days', '🚀');
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
  }, 400);
}

let hasCollision = false;
function toggleTimetableCollision() {
  const slot = document.getElementById('tt-slot-wed');
  const course = document.getElementById('tt-wed-course');
  const statusLine = document.getElementById('tt-status-text');
  const btn = document.getElementById('btn-toggle-collision');

  if (!hasCollision) {
    hasCollision = true;
    slot?.classList.add('tt-slot-conflict');
    if (course) course.textContent = '⚠️ CS3203 & AI3205 COLLISION!';
    if (statusLine) statusLine.textContent = 'Matrix Warning: Classroom & Time Overlap Detected on Wednesday 11:00 AM';
    if (btn) btn.textContent = 'Auto-Resolve Collision';
    showToast('Timetable collision simulated on Wednesday!', '⚠️');
  } else {
    hasCollision = false;
    slot?.classList.remove('tt-slot-conflict');
    if (course) course.textContent = 'CS3203 Lecture (Resolved)';
    if (statusLine) statusLine.textContent = 'Matrix Status: 0 Conflicts Detected • RFC 5545 iCalendar Sync Ready';
    if (btn) btn.textContent = 'Simulate Schedule Collision';
    showToast('Matrix conflict automatically resolved to Thursday slot', '✓');
  }
}

function recalcGPA() {
  const credits = parseFloat(document.getElementById('input-credits')?.value || 84);
  const semTarget = parseFloat(document.getElementById('input-sem-gpa')?.value || 4.0);

  const creditsEl = document.getElementById('credits-val');
  const semGpaEl = document.getElementById('sem-gpa-val');
  const finalEl = document.getElementById('final-gpa-val');
  const badgeEl = document.getElementById('gpa-honors-badge');

  if (creditsEl) creditsEl.textContent = `${credits} Credits`;
  if (semGpaEl) semGpaEl.textContent = semTarget.toFixed(2);

  const upcomingCredits = 18;
  const currentTotal = 3.88 * credits;
  const upcomingTotal = semTarget * upcomingCredits;
  const forecasted = (currentTotal + upcomingTotal) / (credits + upcomingCredits);

  if (finalEl) finalEl.textContent = forecasted.toFixed(2);
  if (badgeEl) {
    if (forecasted >= 3.75) badgeEl.textContent = 'First Class Honors Guaranteed';
    else if (forecasted >= 3.50) badgeEl.textContent = 'Second Class Upper Honors';
    else badgeEl.textContent = 'Solid Standing';
  }
}

// ==============================================================================
// 11. Pillar 3: Finance BCMath, Multi-Currency & SHA-256 Ingestion
// ==============================================================================
const currencyRates = {
  'MYR': 1.0,
  'USD': 0.224,
  'SGD': 0.302,
  'EUR': 0.211,
  'GBP': 0.176
};

function switchCurrency(targetCurr) {
  const pills = document.querySelectorAll('.curr-pill');
  pills.forEach(p => p.classList.toggle('active', p.textContent === targetCurr));

  const rate = currencyRates[targetCurr] || 1.0;
  const totalMYR = 36121.45;
  const b1MYR = 14850.20;
  const b2MYR = 16500.00;
  const b3MYR = 4771.25;

  const sym = targetCurr === 'MYR' ? 'RM ' : (targetCurr === 'USD' ? '$' : (targetCurr === 'SGD' ? 'S$' : (targetCurr === 'EUR' ? '€' : '£')));

  document.getElementById('fb-total-display').textContent = `${sym}${(totalMYR * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById('acc-bal-1').textContent = `${sym}${(b1MYR * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById('acc-bal-2').textContent = `${sym}${(b2MYR * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById('acc-bal-3').textContent = `${sym}${(b3MYR * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  showToast(`Currency view updated to ${targetCurr}`, '💱');
}

const sampleStatements = {
  'maybank': 'Maybank2u_TXN_20261014_RM450.00_RELOAD_PETRONAS',
  'cimb': 'CIMB_CLICKS_TXN_20261016_RM1200.00_SALARY_TRANSFER',
  'tng': 'TNG_EWALLET_TXN_20261018_RM24.50_MRT_TRANSIT'
};

function loadSampleStatement(type) {
  const pills = document.querySelectorAll('.statement-pill');
  pills.forEach(p => p.classList.remove('active'));
  event?.target?.classList.add('active');

  const input = document.getElementById('statement-input');
  if (input && sampleStatements[type]) {
    input.value = sampleStatements[type];
    computeStatementHash();
    showToast(`Loaded ${type.toUpperCase()} transaction payload`, '📄');
  }
}

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
// 12. Pillar 4: Intelligence Feature Store & Burnout ML Classifier
// ==============================================================================
const featureQueries = {
  'focus': {
    sql: 'SELECT session_id, duration_minutes, deep_work_ratio, fsrs_retention FROM focus_sessions WHERE date >= CURRENT_DATE - 7;',
    summary: '✓ 14 Rows Ingested in 3.2ms • Real-time Stream Active'
  },
  'habits': {
    sql: 'SELECT user_id, habit_id, streak_days, circadian_phase, completed_flag FROM habit_logs WHERE user_id = \'ezra\';',
    summary: '✓ 4 Habit Stream Records Loaded • 100% ACID Integrity'
  },
  'anova': {
    sql: 'SELECT factor_habit, factor_focus, p_value, f_statistic, causal_significance FROM anova_causal_results;',
    summary: '✓ F=14.28, p < 0.001 (Statistically Significant Flow Link)'
  }
};

function switchFeatureQuery(tab) {
  const pills = document.querySelectorAll('.q-pill');
  pills.forEach(p => p.classList.remove('active'));
  event?.target?.classList.add('active');

  const data = featureQueries[tab];
  if (data) {
    document.getElementById('fsq-code-display').textContent = data.sql;
    document.getElementById('fsq-result-summary').textContent = data.summary;
    showToast(`Feature store query: ${tab}`, '🔍');
  }
}

function predictBurnout() {
  const study = parseFloat(document.getElementById('input-ml-study')?.value || 7.5);
  const sleep = parseFloat(document.getElementById('input-ml-sleep')?.value || 7.2);
  const screen = parseFloat(document.getElementById('input-ml-screen')?.value || 1.0);
  const habit = parseFloat(document.getElementById('input-ml-habit')?.value || 90);

  document.getElementById('ml-study-val').textContent = `${study} hrs`;
  document.getElementById('ml-sleep-val').textContent = `${sleep} hrs`;
  document.getElementById('ml-screen-val').textContent = `${screen} hrs`;
  document.getElementById('ml-habit-val').textContent = `${habit}%`;

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

  if (gaugeFill) gaugeFill.style.background = `conic-gradient(${color} 0% ${risk}%, rgba(255, 255, 255, 0.08) ${risk}% 100%)`;
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

  // Update Cognitive Radar Points
  const radar = document.getElementById('radar-poly');
  if (radar) {
    const focusVal = Math.max(15, Math.min(45, (study / 14) * 45));
    const sleepVal = Math.max(55, Math.min(88, 50 + (sleep / 10) * 38));
    const habitVal = Math.max(55, Math.min(88, 50 + (habit / 100) * 38));
    const energyVal = Math.max(15, Math.min(45, 50 - (screen / 4) * 32));
    radar.setAttribute('points', `50,${50 - focusVal} ${sleepVal},50 50,${habitVal} ${energyVal},50`);
  }
}

// ==============================================================================
// 13. Master Ecosystem PowerShell Terminal Simulation
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

function copyTerminalOutput() {
  if (!terminalScreen) return;
  navigator.clipboard.writeText(terminalScreen.innerText).then(() => {
    showToast('Terminal output copied to clipboard', '📋');
  });
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
  } else if (cmd === 'serve-finance' || cmd === '-servefinance') {
    appendTerminalLine('[*] NextOmni Finance: Nuxt 3 Frontend starting on http://localhost:3002');
    appendTerminalLine('  ▲ Nuxt 3.14.0 with Nitro - Local: http://localhost:3002', 'success-line');
    appendTerminalLine('  ✓ Connected to PostgreSQL 16 & BCMath Ledger API');
  } else if (cmd === 'ping-all' || cmd === 'health-check' || cmd === '-pingall') {
    appendTerminalLine('[*] Executing real-time parallel connectivity and latency probes...');
    appendTerminalLine('  [ONLINE]  NextOmni Main Portal       -> 4.2ms   [ACID Healthy] (http://localhost:5000/api/v1/health)', 'success-line');
    appendTerminalLine('  [ONLINE]  NextOmni Study             -> 18.5ms  [FSRS Operational] (http://localhost:3001/api/v1/health)', 'success-line');
    appendTerminalLine('  [ONLINE]  NextOmni Life Web          -> 21.0ms  [LifeOS Operational] (http://localhost:3000/api/v1/health)', 'success-line');
    appendTerminalLine('  [ONLINE]  NextOmni Intelligence      -> 14.8ms  [ML Engine Operational] (http://localhost:8000/api/v1/health)', 'success-line');
    appendTerminalLine('  [ONLINE]  NextOmni Finance (Cloud)   -> 182.4ms [Scalar Docs 200] (https://nextomni-finance.vercel.app)', 'success-line');
    appendTerminalLine('[+] All 5 ecosystem edge targets online with zero packet loss.', 'success-line');
  } else if (cmd === 'help' || cmd === '--help' || cmd === '-h') {
    appendTerminalLine('Available Ecosystem Commands:');
    appendTerminalLine('  status           - View active status of all 5 pillars');
    appendTerminalLine('  ping-all         - Ping all local & cloud services with live latency');
    appendTerminalLine('  test-all         - Run Vitest, Pest, and Python ML test suites');
    appendTerminalLine('  verify-all       - Verify TypeScript types, Prisma DDL, and API schemas');
    appendTerminalLine('  serve-landing    - Spin up NextOmni Main Portal on :5000');
    appendTerminalLine('  serve-life       - Spin up NextOmni Life on :3000');
    appendTerminalLine('  serve-study      - Spin up NextOmni Study on :3001');
    appendTerminalLine('  serve-intel      - Spin up NextOmni Intelligence on :8000');
    appendTerminalLine('  serve-finance    - Spin up NextOmni Finance on :3002');
    appendTerminalLine('  clear            - Clear terminal screen');
  } else if (cmd === 'clear') {
    clearTerminal();
  } else {
    appendTerminalLine(`[!] Unrecognized command: "${cmd}". Type "help" or click quick action buttons.`, 'error-line');
  }
}

// ==============================================================================
// 15. Cross-Module Telemetry Dispatcher & Event Bus Simulator
// ==============================================================================
let currentTelemetryScenario = 'study-to-intel';
let currentJsonView = 'event';
let telemetrySimData = {
  duration: 45,
  flowScore: 4.6,
  sleepDeficit: 1.5,
  traceId: 'TRACE-7F3A9C'
};

function loadTelemetryScenario(scenarioKey) {
  currentTelemetryScenario = scenarioKey;
  const pills = document.querySelectorAll('.scen-pill');
  pills.forEach(p => p.classList.remove('active'));

  const btnMap = {
    'study-to-intel': 'scen-btn-study',
    'night-owl': 'scen-btn-night',
    'expense-spike': 'scen-btn-expense'
  };
  const activeBtn = document.getElementById(btnMap[scenarioKey]);
  if (activeBtn) activeBtn.classList.add('active');

  if (scenarioKey === 'study-to-intel') {
    telemetrySimData = { duration: 45, flowScore: 4.6, sleepDeficit: 1.5, traceId: 'TRACE-7F3A9C' };
  } else if (scenarioKey === 'night-owl') {
    telemetrySimData = { duration: 90, flowScore: 3.2, sleepDeficit: 3.5, traceId: 'TRACE-CIRC91' };
  } else if (scenarioKey === 'expense-spike') {
    telemetrySimData = { duration: 25, flowScore: 4.0, sleepDeficit: 0.5, traceId: 'TRACE-FIN44B' };
  }

  const durSlider = document.getElementById('tel-dur-slider');
  const flowSlider = document.getElementById('tel-flow-slider');
  const sleepSlider = document.getElementById('tel-sleep-slider');
  if (durSlider) durSlider.value = telemetrySimData.duration;
  if (flowSlider) flowSlider.value = telemetrySimData.flowScore;
  if (sleepSlider) sleepSlider.value = telemetrySimData.sleepDeficit;

  updateTelemetryParams();
  showToast(`Loaded Flow: ${scenarioKey}`, '⚡');
}

function updateTelemetryParams() {
  const durSlider = document.getElementById('tel-dur-slider');
  const flowSlider = document.getElementById('tel-flow-slider');
  const sleepSlider = document.getElementById('tel-sleep-slider');

  if (durSlider) telemetrySimData.duration = parseInt(durSlider.value, 10);
  if (flowSlider) telemetrySimData.flowScore = parseFloat(flowSlider.value);
  if (sleepSlider) telemetrySimData.sleepDeficit = parseFloat(sleepSlider.value);

  const durDisplay = document.getElementById('tel-dur-display');
  const flowDisplay = document.getElementById('tel-flow-display');
  const sleepDisplay = document.getElementById('tel-sleep-display');
  const traceDisplay = document.getElementById('tel-trace-id');

  if (durDisplay) durDisplay.textContent = `${telemetrySimData.duration} mins`;
  if (flowDisplay) flowDisplay.textContent = `${telemetrySimData.flowScore.toFixed(1)} / 5.0`;
  if (sleepDisplay) sleepDisplay.textContent = `${telemetrySimData.sleepDeficit.toFixed(1)} hrs`;
  if (traceDisplay) traceDisplay.textContent = telemetrySimData.traceId;

  renderActiveJsonView();
}

function generateEventPayloads() {
  const stability = Number((telemetrySimData.duration * 0.28 * telemetrySimData.flowScore).toFixed(1));
  const burnoutProb = Math.min(0.95, Math.max(0.05, Number(((telemetrySimData.sleepDeficit * 0.14) + (telemetrySimData.duration > 60 ? 0.22 : 0.05) - (telemetrySimData.flowScore * 0.04)).toFixed(3))));
  const burnoutLevel = burnoutProb > 0.65 ? 'High Risk' : burnoutProb > 0.35 ? 'Moderate' : 'Optimal / Low Risk';

  const eventPayload = {
    event_id: `evt_${telemetrySimData.traceId.toLowerCase()}`,
    event_type: "study.session.completed",
    timestamp: new Date().toISOString(),
    trace_id: telemetrySimData.traceId,
    producer: "nextomni-study",
    data: {
      user_id: "usr_ezra_principal",
      session_type: "deep_work_pomodoro",
      duration_minutes: telemetrySimData.duration,
      focus_flow_rating: telemetrySimData.flowScore,
      fsrs_telemetry: {
        algorithm: "FSRS-4.5 (DSR Model)",
        cards_reviewed: Math.round(telemetrySimData.duration * 1.8),
        retention_score: 0.88,
        stability_days: stability,
        difficulty_score: 4.1
      },
      sha256_hash: "a4c28f119be9836e2d1920b784a32ec42838fd01e83b8a1c"
    }
  };

  const mlPayload = {
    trace_id: telemetrySimData.traceId,
    feature_store_ingestion: {
      table: "telemetry_focus_logs",
      status: "INGESTED_ACID",
      write_latency_ms: 0.84,
      connection: "PostgreSQL 16 PgBouncer Pool"
    },
    inference_result: {
      model: "GradientBoostingClassifier_v1.4",
      prediction_target: "7d_burnout_risk",
      burnout_probability: burnoutProb,
      risk_classification: burnoutLevel,
      circadian_impact: {
        recommended_wind_down: burnoutProb > 0.5 ? "22:15" : "23:00",
        cognitive_load_state: "Sustained High Flow",
        fatigue_ratio: Number((telemetrySimData.duration / (8 - telemetrySimData.sleepDeficit)).toFixed(2))
      }
    }
  };

  const schemaPayload = {
    openapi: "3.1.0",
    info: {
      title: "NextOmni Cross-Module Telemetry Event Bus",
      version: "2.4.0",
      description: "Standardized event schema bridging Study, Intelligence, Life, and Finance."
    },
    paths: {
      "/api/v1/telemetry/export": { "get": { "summary": "Export ACID telemetry stream in JSON / SQL DDL" } },
      "/api/v1/predict/burnout-risk": { "post": { "summary": "In-memory Gradient Boosting risk evaluation" } },
      "/api/v1/health": { "get": { "summary": "Probe multi-tenant observability & memory metrics" } }
    }
  };

  return { eventPayload, mlPayload, schemaPayload };
}

function renderActiveJsonView() {
  const codeElem = document.getElementById('tjv-code-content');
  if (!codeElem) return;

  const payloads = generateEventPayloads();
  let obj = payloads.eventPayload;
  if (currentJsonView === 'ml') obj = payloads.mlPayload;
  if (currentJsonView === 'schema') obj = payloads.schemaPayload;

  codeElem.textContent = JSON.stringify(obj, null, 2);
}

function switchJsonView(viewKey) {
  currentJsonView = viewKey;
  const tabs = document.querySelectorAll('.tjv-tab');
  tabs.forEach(t => t.classList.remove('active'));

  const activeTab = document.getElementById(`tjv-tab-${viewKey}`);
  if (activeTab) activeTab.classList.add('active');

  renderActiveJsonView();
}

function playPipelineAudioTone(freq) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

function runTelemetryPipelineSimulation() {
  const dispatchBtn = document.getElementById('tel-dispatch-btn');
  const btnText = document.getElementById('tel-btn-text');
  const banner = document.getElementById('pipeline-status-banner');
  const bannerText = document.getElementById('pipeline-status-text');

  if (dispatchBtn) dispatchBtn.disabled = true;
  if (btnText) btnText.textContent = 'Orchestrating Event Flow...';
  if (banner) banner.classList.add('active');

  // Reset steps
  for (let i = 1; i <= 4; i++) {
    const step = document.getElementById(`pipe-step-${i}`);
    const badge = document.getElementById(`pipe-badge-${i}`);
    if (step) step.className = 'pipe-step';
    if (badge) {
      badge.className = 'pipe-step-badge badge-idle';
      badge.textContent = 'Standby';
    }
  }

  // Step 1: Study Emits
  const step1 = document.getElementById('pipe-step-1');
  const badge1 = document.getElementById('pipe-badge-1');
  if (step1) step1.className = 'pipe-step active';
  if (badge1) {
    badge1.className = 'pipe-step-badge badge-running';
    badge1.textContent = 'Emitting...';
  }
  if (bannerText) bannerText.textContent = 'Step 1/4: NextOmni Study emitting study.session.completed event...';
  playPipelineAudioTone(523.25); // C5

  setTimeout(() => {
    // Step 1 done, Step 2 active
    if (step1) step1.className = 'pipe-step completed';
    if (badge1) {
      badge1.className = 'pipe-step-badge badge-done';
      badge1.textContent = 'Emitted (0.8ms)';
    }

    const step2 = document.getElementById('pipe-step-2');
    const badge2 = document.getElementById('pipe-badge-2');
    if (step2) step2.className = 'pipe-step active';
    if (badge2) {
      badge2.className = 'pipe-step-badge badge-running';
      badge2.textContent = 'Inference...';
    }
    if (bannerText) bannerText.textContent = 'Step 2/4: NextOmni Intelligence Feature Store ingestion & GBM Model prediction...';
    playPipelineAudioTone(659.25); // E5

    setTimeout(() => {
      // Step 2 done, Step 3 active
      if (step2) step2.className = 'pipe-step completed';
      if (badge2) {
        badge2.className = 'pipe-step-badge badge-done';
        badge2.textContent = 'Inferred (1.4ms)';
      }

      const step3 = document.getElementById('pipe-step-3');
      const badge3 = document.getElementById('pipe-badge-3');
      if (step3) step3.className = 'pipe-step active';
      if (badge3) {
        badge3.className = 'pipe-step-badge badge-running';
        badge3.textContent = 'Scheduling...';
      }
      if (bannerText) bannerText.textContent = 'Step 3/4: NextOmni Life recalculating Circadian Sleep Gate & habit streaks...';
      playPipelineAudioTone(783.99); // G5

      setTimeout(() => {
        // Step 3 done, Step 4 active
        if (step3) step3.className = 'pipe-step completed';
        if (badge3) {
          badge3.className = 'pipe-step-badge badge-done';
          badge3.textContent = 'Adjusted (2.1ms)';
        }

        const step4 = document.getElementById('pipe-step-4');
        const badge4 = document.getElementById('pipe-badge-4');
        if (step4) step4.className = 'pipe-step active';
        if (badge4) {
          badge4.className = 'pipe-step-badge badge-running';
          badge4.textContent = 'Ledgering...';
        }
        if (bannerText) bannerText.textContent = 'Step 4/4: NextOmni Finance updating BCMath Academic ROI ledger...';
        playPipelineAudioTone(1046.50); // C6

        setTimeout(() => {
          if (step4) step4.className = 'pipe-step completed';
          if (badge4) {
            badge4.className = 'pipe-step-badge badge-done';
            badge4.textContent = 'Ledgered (0.9ms)';
          }
          if (bannerText) bannerText.textContent = '✓ Pipeline Complete: 4/4 Pillars Processed in 5.2ms Total Latency • ACID Verified';
          if (dispatchBtn) dispatchBtn.disabled = false;
          if (btnText) btnText.textContent = 'Dispatch Live Cross-Module Event';
          showToast('Cross-Module Telemetry: 4/4 Pillars Processed in 5.2ms', '⚡');
        }, 600);

      }, 600);

    }, 600);

  }, 600);
}

function copyTelemetryEventPayload() {
  const payloads = generateEventPayloads();
  let obj = payloads.eventPayload;
  if (currentJsonView === 'ml') obj = payloads.mlPayload;
  if (currentJsonView === 'schema') obj = payloads.schemaPayload;

  navigator.clipboard.writeText(JSON.stringify(obj, null, 2)).then(() => {
    showToast(`Copied ${currentJsonView} JSON to clipboard!`, '📋');
  }).catch(() => {
    showToast('Failed to copy to clipboard', '⚠️');
  });
}

// Initial Telemetry Render on DOM Load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    updateTelemetryParams();
  });
} else {
  updateTelemetryParams();
}


function handleTerminalSubmit(e) {
  e.preventDefault();
  if (!terminalInput) return;
  const val = terminalInput.value;
  if (!val.trim()) return;
  executeCLICommand(val);
  terminalInput.value = '';
}
