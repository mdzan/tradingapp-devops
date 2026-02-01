// APP STATE
const API_URL = 'https://open.er-api.com/v6/latest/USD';
let currentRates = { "USD":1, "SGD":1.35, "EUR":0.92, "JPY":150.2, "MYR":4.7 };
let trades = JSON.parse(localStorage.getItem('trade_journal')) || [];
let viewDate = new Date(2026, new Date().getMonth(), 1); // Default to current month in 2026

// INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
    renderCalendar(); updateStats();
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        currentRates = data.rates;
        let ticker = "LIVE MARKETS :: ";
        ['SGD','EUR','GBP','JPY','MYR'].forEach(c => ticker += `${c}: ${data.rates[c].toFixed(3)} | `);
        document.getElementById('rates-marquee').innerText = ticker;
    } catch(e) { console.log("Offline mode"); }
});

// LOGIC
function runQuickConvert() {
    const amt = parseFloat(document.getElementById('qc-amount').value);
    const from = document.getElementById('qc-from').value;
    const to = document.getElementById('qc-to').value;
    if(isNaN(amt)) return;
    const res = (amt / currentRates[from]) * currentRates[to];
    document.getElementById('qc-result').innerText = `${to} ${res.toFixed(2)}`;
}

function changeMonth(step) {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + step, 1);
    if(next.getFullYear() !== 2026) return alert("Journal restricted to 2026.");
    viewDate = next;
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-days'); grid.innerHTML = '';
    const year = viewDate.getFullYear(); const month = viewDate.getMonth();
    document.getElementById('current-month-year').innerText = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) grid.appendChild(document.createElement('div'));

    for(let i=1; i<=daysInMonth; i++) {
        const dayDiv = document.createElement('div'); dayDiv.className = 'day-cell';
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        const dayTrades = trades.filter(t => t.date === dateStr);
        
        let html = `<span>${i}</span>`;
        if(dayTrades.length > 0) {
            const total = dayTrades.reduce((acc, t) => acc + t.sgdAmount, 0);
            html += `<div class="pnl-chip ${total>=0?'win':'loss'}">$${Math.abs(total).toFixed(0)}</div>`;
        }
        dayDiv.innerHTML = html;
        dayDiv.onclick = () => openModal(dateStr);
        grid.appendChild(dayDiv);
    }
}

// MODAL
const modal = document.getElementById('journal-modal');
function openModal(date) {
    modal.classList.add('active');
    document.getElementById('trade-date').value = date;
}
function closeModal() { modal.classList.remove('active'); }

document.getElementById('trade-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('trade-date').value;
    const cur = document.getElementById('currency-select').value;
    const amt = parseFloat(document.getElementById('pnl-amount').value);
    
    const sgd = (amt / currentRates[cur]) * currentRates['SGD'];
    trades.push({ id: Date.now(), date, cur, amt, sgdAmount: sgd });
    localStorage.setItem('trade_journal', JSON.stringify(trades));
    
    closeModal(); renderCalendar(); updateStats();
});

function updateStats() {
    let total=0, wins=0, best=0;
    trades.forEach(t => { total+=t.sgdAmount; if(t.sgdAmount>0)wins++; if(t.sgdAmount>best)best=t.sgdAmount; });
    document.getElementById('total-pnl').innerText = `$${total.toFixed(2)}`;
    document.getElementById('total-pnl').className = `stat-value ${total>=0?'text-profit':'text-loss'}`;
    document.getElementById('win-rate').innerText = trades.length ? Math.round((wins/trades.length)*100)+'%' : '0%';
    document.getElementById('best-trade').innerText = `$${best.toFixed(2)}`;
}
