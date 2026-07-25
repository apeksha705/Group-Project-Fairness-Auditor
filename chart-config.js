/* =========================================================
   WORKLENS — CHART.JS THEME CONFIG
   Dark "instrument" theme, shared tooltip styling, and the
   gradient-fill helper used by every chart in script.js.
   Exposed on window.ChartConfig so it loads independently of
   the sample data and app logic.
========================================================= */
(function () {
  "use strict";

  Chart.defaults.color = '#8A96A6';
  Chart.defaults.font.family = "'JetBrains Mono', monospace";
  Chart.defaults.font.size = 11;

  const gridColor = '#1B2330';

  const sharedTooltip = {
    backgroundColor: '#171F2B',
    borderColor: '#232C3A',
    borderWidth: 1,
    titleColor: '#E7ECF2',
    bodyColor: '#8A96A6',
    titleFont: { family: "'Space Grotesk', sans-serif", weight: '600', size: 12 },
    bodyFont: { family: "'JetBrains Mono', monospace", size: 11 },
    padding: 10,
    cornerRadius: 8,
    displayColors: true,
    boxPadding: 4
  };

  function makeGradient(ctx, color) {
    const g = ctx.createLinearGradient(0, 0, 0, 220);
    g.addColorStop(0, color + 'CC');
    g.addColorStop(1, color + '18');
    return g;
  }

  window.ChartConfig = { gridColor, sharedTooltip, makeGradient };
})();
