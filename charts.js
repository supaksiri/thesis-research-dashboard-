const chartRegistry = {};

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function destroyChart(key) {
  if (chartRegistry[key]) {
    chartRegistry[key].destroy();
    delete chartRegistry[key];
  }
}

function chartBaseOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 650, easing: 'easeOutQuart' },
    plugins: {
      legend: { labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, color: cssVar('--ink-2'), font: { family: 'Sarabun', size: 13 } } },
      tooltip: { backgroundColor: '#0f2747', titleFont: { family: 'Sarabun', weight: '700' }, bodyFont: { family: 'Sarabun' }, padding: 12, cornerRadius: 10 }
    },
    scales: {
      x: { grid: { color: 'rgba(16,55,102,.08)' }, ticks: { color: cssVar('--ink-3'), font: { family: 'Sarabun' } }, border: { display: false } },
      y: { grid: { color: 'rgba(16,55,102,.08)' }, ticks: { color: cssVar('--ink-3'), font: { family: 'Sarabun' } }, border: { display: false } }
    }
  };
}

const valueLabelPlugin = {
  id: 'valueLabel',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.font = '600 12px Sarabun';
    ctx.fillStyle = '#40536b';
    chart.data.datasets.forEach((dataset, di) => {
      const meta = chart.getDatasetMeta(di);
      meta.data.forEach((el, i) => {
        const v = dataset.data[i];
        if (v === null || typeof v === 'undefined') return;
        const pos = el.tooltipPosition();
        ctx.textBaseline = 'middle';
        ctx.textAlign = chart.options.indexAxis === 'y' ? 'left' : 'center';
        const x = chart.options.indexAxis === 'y' ? pos.x + 8 : pos.x;
        const y = chart.options.indexAxis === 'y' ? pos.y : pos.y - 12;
        ctx.fillText(typeof v === 'number' ? v.toFixed(dataset.precision ?? 2) : v, x, y);
      });
    });
    ctx.restore();
  }
};

function renderCurrentDesiredChart() {
  const canvas = document.getElementById('currentDesiredChart');
  if (!canvas || typeof Chart === 'undefined') return;
  destroyChart('currentDesired');
  const options = chartBaseOptions();
  options.indexAxis = 'y';
  options.scales.x.min = 0;
  options.scales.x.max = 5;
  options.scales.x.ticks.stepSize = 1;
  options.plugins.legend.position = 'top';
  options.layout = { padding: { right: 42 } };
  chartRegistry.currentDesired = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: researchData.areas.map(a => a.short),
      datasets: [
        { label: 'สภาพปัจจุบัน', data: researchData.areas.map(a => a.current), backgroundColor: '#1D66B2', borderRadius: 6, barThickness: 15, precision: 2 },
        { label: 'สภาพที่พึงประสงค์', data: researchData.areas.map(a => a.desired), backgroundColor: '#F26D3D', borderRadius: 6, barThickness: 15, precision: 2 }
      ]
    },
    options,
    plugins: [valueLabelPlugin]
  });
}

function renderPriorityChart() {
  const canvas = document.getElementById('priorityChart');
  if (!canvas || typeof Chart === 'undefined') return;
  destroyChart('priority');
  const ranked = [...researchData.areas].sort((a,b) => a.rank - b.rank);
  const options = chartBaseOptions();
  options.indexAxis = 'y';
  options.plugins.legend.display = false;
  options.scales.x.min = 0;
  options.scales.x.max = 0.26;
  options.scales.x.ticks.callback = v => Number(v).toFixed(2);
  options.layout = { padding: { right: 52 } };
  chartRegistry.priority = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ranked.map(a => `อันดับ ${a.rank} · ${a.short}`),
      datasets: [{
        label: 'PNI Modified',
        data: ranked.map(a => a.pni),
        backgroundColor: ranked.map((_,i) => i < 3 ? '#F26D3D' : '#1D66B2'),
        borderRadius: 8,
        barThickness: 22,
        precision: 4
      }]
    },
    options,
    plugins: [valueLabelPlugin]
  });
}

function renderEvaluationChart() {
  const canvas = document.getElementById('evaluationChart');
  if (!canvas || typeof Chart === 'undefined') return;
  destroyChart('evaluation');
  const options = chartBaseOptions();
  options.scales.y.min = 0;
  options.scales.y.max = 5;
  options.scales.y.ticks.stepSize = 1;
  options.plugins.legend.position = 'top';
  options.layout = { padding: { top: 18 } };
  chartRegistry.evaluation = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: researchData.evaluation.main.map(x => `กลยุทธ์ ${x.strategy}`),
      datasets: [
        { label: 'ความเหมาะสม', data: researchData.evaluation.main.map(x => x.appropriate), backgroundColor: '#2F8F68', borderRadius: 7, precision: 2 },
        { label: 'ความเป็นไปได้', data: researchData.evaluation.main.map(x => x.feasible), backgroundColor: '#705BC6', borderRadius: 7, precision: 2 }
      ]
    },
    options,
    plugins: [valueLabelPlugin]
  });
}

function renderChartsForSection(sectionId) {
  if (sectionId === 'current-desired') renderCurrentDesiredChart();
  if (sectionId === 'priority') renderPriorityChart();
  if (sectionId === 'evaluation') renderEvaluationChart();
}
