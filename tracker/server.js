const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data', 'events.json');
const DASHBOARD_PASSWORD = process.env.TRACKER_PASSWORD || 'franceathome2026';

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Helpers ─────────────────────────────────────────────────
function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initial = {
            pageviews: 0,
            sessions: {},
            buttons: {},
            daily: {},
            hourly: Array(24).fill(0)
        };
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
        return initial;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function today() {
    return new Date().toISOString().split('T')[0];
}

// ── POST /api/track ─────────────────────────────────────────
app.post('/api/track', (req, res) => {
    try {
        const { event, label, session_id, referrer } = req.body;
        const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || '').split(',')[0].trim();
        const data = loadData();
        const date = today();
        const hour = new Date().getHours();

        if (!data.daily[date]) data.daily[date] = { pageviews: 0, buttons: {} };
        if (!data.hourly) data.hourly = Array(24).fill(0);

        if (event === 'pageview') {
            data.pageviews++;
            data.daily[date].pageviews++;
            data.hourly[hour] = (data.hourly[hour] || 0) + 1;

            if (session_id && !data.sessions[session_id]) {
                data.sessions[session_id] = {
                    date: new Date().toISOString(),
                    referrer: referrer || 'direct',
                    ip
                };
            }
        }

        if (event === 'click' && label) {
            data.buttons[label] = (data.buttons[label] || 0) + 1;
            if (!data.daily[date].buttons) data.daily[date].buttons = {};
            data.daily[date].buttons[label] = (data.daily[date].buttons[label] || 0) + 1;
        }

        saveData(data);
        res.json({ ok: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ ok: false });
    }
});

// ── GET /api/stats ──────────────────────────────────────────
app.get('/api/stats', (req, res) => {
    const pwd = req.query.pwd;
    if (pwd !== DASHBOARD_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = loadData();

    // Last 14 days
    const last14 = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        last14.push({ date: key, pageviews: data.daily[key]?.pageviews || 0 });
    }

    const totalClicks = Object.values(data.buttons).reduce((a, b) => a + b, 0);
    const uniqueSessions = Object.keys(data.sessions).length;
    const convRate = uniqueSessions > 0 ? ((totalClicks / uniqueSessions) * 100).toFixed(1) : 0;

    res.json({
        total_pageviews: data.pageviews,
        unique_sessions: uniqueSessions,
        total_clicks: totalClicks,
        conversion_rate: convRate,
        buttons: data.buttons,
        daily: last14,
        hourly: data.hourly || Array(24).fill(0),
        recent_sessions: Object.entries(data.sessions)
            .slice(-20)
            .reverse()
            .map(([id, s]) => ({ referrer: s.referrer, date: s.date }))
    });
});

// ── GET /api/verify-password ─────────────────────────────────
app.get('/api/verify-password', (req, res) => {
    const pwd = req.query.pwd;
    res.json({ ok: pwd === DASHBOARD_PASSWORD });
});

// ── Health ───────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Tracker running on port ${PORT}`);
});
