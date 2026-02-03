// APP STATE
const API_URL = 'https://open.er-api.com/v6/latest/USD';
let currentRates = { "USD":1, "SGD":1.35 };
let trades = JSON.parse(localStorage.getItem('tj_v2_data')) || [];
let viewDate = new Date(2026, new Date().getMonth(), 1);
let charts = {};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    renderCalendar(); 
    updateStats();
    initCharts();
    await fetchRates();
    setInterval(fetchRates, 60000);
});

// CORE LOGIC FUNCTIONS (Exported for Jest)
const convertToSGD = (amount, currency, rateTable = currentRates) => {
    if (!rateTable[currency] || !rateTable['SGD']) return 0;
    const res = (amount / rateTable[currency]) * rateTable['SGD'];
    return parseFloat(res.toFixed(2));
};

const calculateStats = (tradeList) => {
    let total = 0, wins = 0;
    tradeList.forEach(t => {
        total += t.sgdAmount;
        if (t.sgdAmount > 0) wins++;
    });
    return {
        total: total.toFixed(2),
        winRate: tradeList.length ? Math.round((wins / tradeList.length) * 100).toString() : "0"
    };
};

// MARKET SYNC
async function fetchRates() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        currentRates = data.rates;
        let ticker = "LIVE MARKETS :: ";
        ['SGD','EUR','GBP','JPY','MYR'].forEach(c => ticker += `${c}: ${currentRates[c].toFixed(3)} | `);
        document.getElementById('rates-marquee').innerText = ticker;
        updateStats();
        updateVisuals();
    } catch(e) { console.log("Offline mode"); }
}

// VISUALS
function initCharts() {
    const isLight = document.body.classList.contains('light-theme');
    const gridColor = isLight ? '#e2e8f0' : '#1e293b';

    const mainCtx = document.getElementById('mainEquityChart');
    if (mainCtx) {
        charts.main = new Chart(mainCtx, {
            type: 'line',
            data: { labels: [], datasets: [{ data: [], borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)', fill: true, tension: 0.4 }] },
            options: { plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { grid: { color: gridColor } } }, maintainAspectRatio: false }
        });
    }

    const sparkCtx = document.getElementById('sparklineChart');
    if (sparkCtx) {
        charts.spark = new Chart(sparkCtx, {
            type: 'line',
            data: { labels: [], datasets: [{ data: [], borderColor: '#10b981', borderWidth: 2, pointRadius: 0, fill: false }] },
            options: { plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, maintainAspectRatio: false }
        });
    }

    const gaugeCtx = document.getElementById('winGauge');
    if (gaugeCtx) {
        charts.gauge = new Chart(gaugeCtx, {
            type: 'doughnut',
            data: { datasets: [{ data: [0, 100], backgroundColor: ['#10b981', isLight ? '#f1f5f9' : '#1e293b'], borderWidth: 0, circumference: 180, rotation: 270, cutout: '80%' }] },
            options: { plugins: { legend: { display: false } }, maintainAspectRatio: false }
        });
    }
    updateVisuals();
}

function updateVisuals() {
    if(!charts.main) return;
    const sorted = [...trades].sort((a,b) => new Date(a.date) - new Date(b.date));
    let cum = 0;
    const pts = sorted.map(t => {
        cum += t.sgdAmount;
        return cum;
    });

    charts.main.data.labels = pts.map((_,i) => i);
    charts.main.data.datasets[0].data = pts;
    charts.main.update();

    charts.spark.data.labels = pts.map((_,i) => i);
    charts.spark.data.datasets[0].data = pts;
    charts.spark.data.datasets[0].borderColor = cum >= 0 ? '#10b981' : '#f43f5e';
    charts.spark.update();

    const stats = calculateStats(trades);
    const wr = parseInt(stats.winRate);
    charts.gauge.data.datasets[0].data = [wr, 100 - wr];
    charts.gauge.update();
}

// CALENDAR & UI
function renderCalendar() {
    const grid = document.getElementById('calendar-days'); 
    if (!grid) return;
    grid.innerHTML = '';
    const y = viewDate.getFullYear(), m = viewDate.getMonth();
    document.getElementById('current-month-year').innerText = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();

    for(let i=0; i<first; i++) grid.appendChild(document.createElement('div'));

    for(let i=1; i<=days; i++) {
        const d = document.createElement('div'); 
        d.className = 'day-cell';
        const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        const dt = trades.filter(t => t.date === ds);
        
        d.innerHTML = `<span class="day-num">${i}</span>`;
        if(dt.length > 0) {
            d.innerHTML += `<div class="trade-count">${dt.length} trades</div>`;
            const total = dt.reduce((acc, t) => acc + t.sgdAmount, 0);
            d.innerHTML += `<div class="pnl-chip ${total>=0?'win':'loss'}">$${Math.abs(total).toFixed(0)}</div>`;
        }
        d.onclick = () => openModal(ds);
        if(y === new Date().getFullYear() && m === new Date().getMonth() && i === new Date().getDate()) d.classList.add('today');
        grid.appendChild(d);
    }
}

// MODAL
function openModal(date) {
    document.getElementById('journal-modal').classList.add('active');
    document.getElementById('trade-date').value = date;
}
function closeModal() { document.getElementById('journal-modal').classList.remove('active'); }

const form = document.getElementById('trade-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('trade-date').value;
        const cur = document.getElementById('currency-select').value;
        const amt = parseFloat(document.getElementById('pnl-amount').value);
        const note = document.getElementById('trade-note').value;
        
        const sgd = convertToSGD(amt, cur);
        trades.push({ id: Date.now(), date, cur, amt, sgdAmount: sgd, note });
        localStorage.setItem('tj_v2_data', JSON.stringify(trades));
        
        closeModal(); renderCalendar(); updateStats(); updateVisuals();
    });
}

function updateStats() {
    const stats = calculateStats(trades);
    const totalEl = document.getElementById('total-pnl');
    totalEl.innerText = `$${parseFloat(stats.total).toLocaleString()}`;
    totalEl.className = `stat-value ${parseFloat(stats.total) >= 0 ? 'text-profit' : 'text-loss'}`;
    document.getElementById('win-rate').innerText = stats.winRate + '%';
}

function initTheme() {
    if(localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');
}
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    location.reload(); 
}

// Export for Jest
if (typeof module !== 'undefined') {
    module.exports = { convertToSGD, calculateStats };
}
