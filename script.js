/* =========================================================
   WORKLENS — APP LOGIC
   Nav, scroll reveal, drag & drop, hero preview animation,
   Chart.js dashboards, animated counters, and the "generate
   report" demo flow.

   Load order (see index.html):
     1. lib/chart-config.js  → window.ChartConfig
     2. data.js              → global `sampleData`
     3. script.js (this file)
========================================================= */
(function(){
  "use strict";

  // Safety net: if anything below throws, make sure every section is
  // still visible rather than silently stuck at opacity:0.
  window.addEventListener('error', () => {
    document.documentElement.classList.remove('js-ready');
  });

  /* -------------------------------------------------------
     1. MOBILE MENU TOGGLE
  ------------------------------------------------------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
  });

  /* -------------------------------------------------------
     2. SCROLL REVEAL — only opt into the animated hidden state
        once the observer is attached and guaranteed to reveal
        every section; a fallback timer force-reveals anything
        left behind after 2.5s (covers slow/blocked observers).
  ------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
  document.documentElement.classList.add('js-ready');
  setTimeout(() => { revealEls.forEach(el => el.classList.add('in-view')); }, 2500);

  /* -------------------------------------------------------
     3. NAVBAR SHADOW ON SCROLL
  ------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10 ? '0 8px 24px -12px rgba(0,0,0,0.5)' : 'none';
  });

  /* -------------------------------------------------------
     4. DRAG & DROP UPLOAD ZONES
  ------------------------------------------------------- */
  function wireDropzone(zoneId, inputId, iconId, labelId){
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    const label = document.getElementById(labelId);

    const showFile = (name) => {
      zone.classList.add('file-loaded');
      icon.setAttribute('class', 'w-6 h-6 text-[var(--teal)] mb-3 shrink-0 inline-block');
      icon.innerHTML = '<circle cx="12" cy="12" r="9"/><path d="M8 12.5L10.8 15L16 9.5"/>';
      label.textContent = name;
    };

    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => { if (e.target.files.length) showFile(e.target.files[0].name); });

    ['dragenter','dragover'].forEach(evt =>
      zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.add('drag-active'); })
    );
    ['dragleave','drop'].forEach(evt =>
      zone.addEventListener(evt, (e) => { e.preventDefault(); zone.classList.remove('drag-active'); })
    );
    zone.addEventListener('drop', (e) => { if (e.dataTransfer.files.length) showFile(e.dataTransfer.files[0].name); });
  }
  wireDropzone('dropzoneDataset', 'datasetInput', 'datasetIcon', 'datasetLabel');
  wireDropzone('dropzoneModel', 'modelInput', 'modelIcon', 'modelLabel');

  /* -------------------------------------------------------
     5. HERO PREVIEW — team rows + heatmap ("product screenshot")
        Uses `sampleData` from data.js (loaded before this file).
  ------------------------------------------------------- */
  const heroRowsEl = document.getElementById('heroTeamRows');
  sampleData.heroContribution.forEach((m, i) => {
    const color = sampleData.memberColors[i];
    const flagged = m.status === 'Flagged';
    const row = document.createElement('div');
    row.className = 'flex items-center gap-3';
    row.innerHTML = `
      <span class="w-7 h-7 rounded-full flex items-center justify-center font-mono text-[0.65rem] font-semibold shrink-0"
            style="background:${color}22; color:${color};">${m.name[0]}</span>
      <span class="text-sm w-14 shrink-0">${m.name}</span>
      <span class="contrib-bar"><span class="contrib-bar-fill" data-target="${m.pct}" style="background:${color};"></span></span>
      <span class="font-mono text-xs w-10 text-right shrink-0 counter-hero" data-target="${m.pct}">0%</span>
      <span class="badge ${flagged ? 'badge-fail' : 'badge-pass'} shrink-0"><span class="badge-dot"></span>${flagged ? 'Flag' : 'OK'}</span>
    `;
    heroRowsEl.appendChild(row);
  });

  const heroHeatmapEl = document.getElementById('heroHeatmap');
  const heatIntensities = [0.08,0.15,0.3,0.15,0.45,0.6,0.08,0.3,0.7,0.85,0.45,0.15,0.08,0.08,
                            0.15,0.3,0.45,0.6,0.7,0.85,0.15,0.45,0.6,0.3,0.15,0.08,0.08,0.15,
                            0.3,0.45,0.08,0.15,0.6,0.7,0.85,0.6,0.3,0.15,0.08,0.15,0.3,0.45,0.6,0.08];
  heatIntensities.forEach(v => {
    const cell = document.createElement('div');
    cell.className = 'heat-cell';
    cell.dataset.intensity = v;
    heroHeatmapEl.appendChild(cell);
  });

  let heroAnimated = false;
  function animateHero(){
    if (heroAnimated) return;
    heroAnimated = true;
    document.querySelectorAll('.contrib-bar-fill').forEach(el => {
      requestAnimationFrame(() => { el.style.width = el.dataset.target + '%'; });
    });
    document.querySelectorAll('.counter-hero').forEach(el => {
      animateCounter(el, parseFloat(el.dataset.target), 0, 1100, '%');
    });
    document.querySelectorAll('.heat-cell').forEach((cell, i) => {
      setTimeout(() => { cell.style.background = `rgba(45,212,191,${cell.dataset.intensity})`; }, i * 18);
    });
  }
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting){ animateHero(); heroObserver.disconnect(); } });
  }, { threshold: 0.2 });
  heroObserver.observe(document.getElementById('hero'));

  /* -------------------------------------------------------
     6. CHART BUILD — theme, gradients, and tooltip styling
        come from window.ChartConfig (lib/chart-config.js).
  ------------------------------------------------------- */
  const { gridColor, sharedTooltip, makeGradient } = window.ChartConfig;

  let barChart, radarChart, lineChart, chartsBuilt = false;

  function buildCharts(){
    if (chartsBuilt) return;
    chartsBuilt = true;

    // --- Bar chart: contribution by team member ---
    const barCtx = document.getElementById('barChart').getContext('2d');
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: sampleData.members,
        datasets: [
          { label: 'Commits %', data: sampleData.commitShare, backgroundColor: makeGradient(barCtx, '#2DD4BF'), borderRadius: 6, maxBarThickness: 48 },
          { label: 'Docs & Tasks %', data: sampleData.docsTaskShare, backgroundColor: makeGradient(barCtx, '#F5A524'), borderRadius: 6, maxBarThickness: 48 }
        ]
      },
      options: {
        responsive: true,
        animation: { duration: 900, easing: 'easeOutCubic' },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: 'circle' } },
          tooltip: { ...sharedTooltip, callbacks: { label: (c) => ` ${c.dataset.label}: ${c.parsed.y}%` } }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: gridColor }, ticks: { callback: v => v + '%' } }
        }
      }
    });

    // --- Radar chart: contribution profile ---
    radarChart = new Chart(document.getElementById('radarChart'), {
      type: 'radar',
      data: {
        labels: sampleData.contributionProfile.labels,
        datasets: [{
          label: 'Score',
          data: sampleData.contributionProfile.values,
          backgroundColor: 'rgba(45,212,191,0.15)',
          borderColor: '#2DD4BF',
          pointBackgroundColor: '#2DD4BF',
          pointHoverRadius: 6,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 900, easing: 'easeOutCubic' },
        layout: { padding: { top: 8, bottom: 8, left: 28, right: 28 } },
        plugins: { legend: { display: false }, tooltip: { ...sharedTooltip, callbacks: { label: (c) => ` ${c.label}: ${c.formattedValue}` } } },
        scales: {
          r: {
            min: 0, max: 1,
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: { font: { size: 9.5 }, padding: 6 },
            ticks: { display: false, stepSize: 0.25 }
          }
        }
      }
    });

    // --- Line chart: team score trend ---
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    const lineGradient = lineCtx.createLinearGradient(0, 0, 0, 220);
    lineGradient.addColorStop(0, 'rgba(45,212,191,0.35)');
    lineGradient.addColorStop(1, 'rgba(45,212,191,0.02)');

    lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: sampleData.trend.labels,
        datasets: [{
          label: 'Team score',
          data: sampleData.trend.values,
          borderColor: '#2DD4BF',
          backgroundColor: lineGradient,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#2DD4BF',
          pointRadius: 4,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        animation: { duration: 1000, easing: 'easeOutCubic' },
        interaction: { mode: 'nearest', intersect: false },
        plugins: { legend: { display: false }, tooltip: { ...sharedTooltip, callbacks: { label: (c) => ` Score: ${c.formattedValue}` } } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: gridColor }, min: 40, max: 100 }
        }
      }
    });
  }

  const dashboardSection = document.getElementById('dashboard');
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting){ buildCharts(); chartObserver.disconnect(); } });
  }, { threshold: 0.05 });
  chartObserver.observe(dashboardSection);

  /* -------------------------------------------------------
     7. ANIMATED COUNTERS for metric cards + overall score ring
  ------------------------------------------------------- */
  function animateCounter(el, target, decimals = 0, duration = 1200, suffix = ''){
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function animateDashboardNumbers(){
    document.querySelectorAll('.metric-card .counter').forEach(el => {
      const target = parseFloat(el.textContent);
      animateCounter(el, target, 2);
    });
    const scoreEl = document.getElementById('overallScore');
    animateCounter(scoreEl, sampleData.overallScore, 0);
    const ring = document.getElementById('overallRing');
    const circumference = 326.7;
    const offset = circumference - (sampleData.overallScore / 100) * circumference;
    requestAnimationFrame(() => { ring.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)'; ring.style.strokeDashoffset = offset; });
  }

  let numbersAnimated = false;
  const numbersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !numbersAnimated){
        numbersAnimated = true;
        animateDashboardNumbers();
        numbersObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });
  numbersObserver.observe(dashboardSection);

  /* -------------------------------------------------------
     8. GENERATE REPORT BUTTON → LOADING ANIMATION → DASHBOARD
  ------------------------------------------------------- */
  const runAuditBtn = document.getElementById('runAuditBtn');
  const overlay = document.getElementById('loadingOverlay');
  const loadingStatus = document.getElementById('loadingStatus');
  const loadingBar = document.getElementById('loadingBar');

  const steps = [
    'Reading commit history…',
    'Reading document activity…',
    'Scoring contribution confidence…',
    'Scoring participation index…',
    'Scoring project health…',
    'Scoring team activity…',
    'Generating insights…'
  ];

  function showOverlay(){
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => { overlay.classList.remove('opacity-0','invisible'); });
  }
  function hideOverlay(){
    overlay.classList.add('opacity-0','invisible');
    setTimeout(() => overlay.classList.add('hidden'), 350);
  }

  runAuditBtn.addEventListener('click', () => {
    showOverlay();
    let i = 0;
    loadingBar.style.width = '0%';
    loadingStatus.textContent = steps[0];

    const interval = setInterval(() => {
      i++;
      loadingBar.style.width = Math.min((i / steps.length) * 100, 100) + '%';
      if (i < steps.length){
        loadingStatus.textContent = steps[i];
      } else {
        clearInterval(interval);
        setTimeout(() => {
          hideOverlay();
          document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
          buildCharts();
          if (!numbersAnimated){ numbersAnimated = true; animateDashboardNumbers(); }
          document.getElementById('lastRun').textContent = 'Report generated just now · Capstone Team Project';
        }, 400);
      }
    }, 420);
  });

  /* -------------------------------------------------------
     9. SMOOTH-SCROLL for internal nav links
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl){
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
