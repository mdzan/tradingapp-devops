/* --- THEME COLORS --- */
:root {
    --bg-main: #0f172a; 
    --bg-card: #1e293b; 
    --bg-hover: #334155;
    --text-main: #f1f5f9; 
    --text-muted: #94a3b8;
    --primary: #6366f1; 
    --primary-hover: #4f46e5;
    --profit: #10b981; 
    --profit-bg: rgba(16, 185, 129, 0.15);
    --loss: #f43f5e; 
    --loss-bg: rgba(244, 63, 94, 0.15);
    --border: #334155;
}

/* --- RESET & BODY --- */
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
body { background-color: var(--bg-main); color: var(--text-main); min-height: 100vh; display: flex; flex-direction: column; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; width: 100%; }

/* --- HEADER & STATS --- */
.header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 30px; }
.logo { font-size: 1.5rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 10px; }
.logo i { color: var(--primary); }
.status-badge { font-size: 0.9rem; color: var(--profit); background: var(--profit-bg); padding: 5px 10px; border-radius: 20px; border: 1px solid var(--profit); }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; }
.stat-card { background: var(--bg-card); padding: 24px; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
.stat-label { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 5px; }
.stat-value { font-size: 2rem; font-weight: 700; }
.text-profit { color: var(--profit); } 
.text-loss { color: var(--loss); }

/* --- DASHBOARD GRID --- */
.dashboard-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 24px; }
@media (max-width: 900px) { .dashboard-grid { grid-template-columns: 1fr; } }

.card { background: var(--bg-card); padding: 24px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-title { font-size: 1.2rem; font-weight: 600; display: flex; align-items: center; gap: 10px; }

/* --- FORMS --- */
.form-group { margin-bottom: 15px; }
label { display: block; color: var(--text-muted); margin-bottom: 8px; font-size: 0.9rem; }
input, select { width: 100%; background: var(--bg-main); border: 1px solid var(--border); color: var(--text-main); padding: 12px; border-radius: 10px; font-size: 1rem; outline: none; transition: 0.2s; }
input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2); }

.btn { width: 100%; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
.btn-secondary { background: transparent; border: 1px solid var(--border); color: var(--text-muted); }
.btn-secondary:hover { background: var(--bg-main); color: var(--text-main); }

/* --- CALENDAR --- */
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
.weekday-label { text-align: center; color: var(--text-muted); font-size: 0.85rem; padding-bottom: 10px; font-weight: bold; }

.day-cell { 
    aspect-ratio: 1; 
    background: var(--bg-main); 
    border-radius: 12px; 
    padding: 8px; 
    border: 1px solid transparent; 
    display: flex; 
    flex-direction: column; 
    cursor: pointer; 
    transition: all 0.2s ease; 
    position: relative; 
}
.day-cell:hover { border-color: var(--primary); background: var(--bg-hover); transform: scale(1.05); z-index: 2; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
.day-cell.today { border-color: var(--primary); box-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }

.pnl-chip { 
    font-size: 0.75rem; 
    padding: 4px; 
    border-radius: 6px; 
    text-align: center; 
    font-weight: 700; 
    margin-top: auto; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.pnl-chip.win { background: var(--profit-bg); color: var(--profit); }
.pnl-chip.loss { background: var(--loss-bg); color: var(--loss); }

/* --- MODAL --- */
.modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 100; justify-content: center; align-items: center; backdrop-filter: blur(5px); }
.modal-overlay.active { display: flex; animation: fadeIn 0.2s ease-out; }
.modal-content { background: var(--bg-card); padding: 30px; border-radius: 20px; width: 90%; max-width: 450px; border: 1px solid var(--border); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
.close-modal { float: right; cursor: pointer; font-size: 1.5rem; background: none; border: none; color: var(--text-muted); transition: 0.2s; }
.close-modal:hover { color: var(--text-main); transform: rotate(90deg); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* --- TICKER --- */
.ticker-wrap { position: fixed; bottom: 0; left: 0; width: 100%; background: var(--bg-card); border-top: 1px solid var(--border); padding: 10px 0; font-family: monospace; color: var(--text-muted); font-size: 0.9rem; }
