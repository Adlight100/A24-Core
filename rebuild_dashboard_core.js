const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dashboard.html');

const pristineDashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>A24 NOC Control Center</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #060913; color: #cbd5e1; padding: 14px; min-height: 100vh; padding-bottom: 40px; }
        header { background-color: #090d1a; border: 1px solid #1e293b; padding: 14px; border-radius: 12px; margin-bottom: 16px; }
        .header-top { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .logo { font-size: 16px; font-weight: bold; color: #10b981; text-transform: uppercase; text-decoration: none; font-family: monospace; }
        .menu-toggle-btn { background: #0f172a; border: 1px solid #334155; color: #10b981; font-size: 18px; padding: 4px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px; display: inline-block; }
        .sidebar-menu { display: none; background: #090d1a; border: 1px solid #1e293b; padding: 14px; border-radius: 12px; margin-bottom: 16px; flex-direction: column; gap: 4px; }
        .sidebar-menu.open { display: flex; }
        .sidebar-brand { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #475569; font-family: monospace; padding-bottom: 6px; border-bottom: 1px solid #1e293b; margin-bottom: 6px; }
        .nav-item { display: block; padding: 10px 12px; color: #cbd5e1; text-decoration: none; font-size: 12px; border-radius: 6px; font-weight: bold; text-transform: uppercase; font-family: monospace; transition: background 0.2s ease; }
        .nav-item:hover, .nav-item.active { background: #0f172a; color: #10b981; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
        .stat-card { background: #0f172a; border: 1px solid #1e293b; padding: 12px; border-radius: 10px; text-align: center; }
        .stat-card.active-card { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.01); }
        .stat-label { font-size: 9px; text-transform: uppercase; color: #64748b; font-family: monospace; font-weight: bold; }
        .stat-value { font-size: 14px; font-weight: bold; margin-top: 4px; font-family: monospace; }
        .diag-grid { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 16px; }
        @media(min-width: 768px) { .diag-grid { grid-template-columns: repeat(2, 1fr); } }
        .diag-card { background: #020617; border: 1px dashed #1e293b; padding: 14px; border-radius: 10px; font-family: monospace; font-size: 11px; }
        .diag-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #0f172a; }
        .diag-title { color: #64748b; font-weight: bold; text-transform: uppercase; font-size: 10px; }
        .diag-metric { font-size: 16px; font-weight: bold; color: #10b981; margin: 4px 0; }
        .graph-mock-container { height: 40px; display: flex; align-items: flex-end; gap: 2px; margin-top: 8px; background: rgba(15,23,42,0.4); padding: 4px; border-radius: 4px; }
        .graph-bar { flex: 1; background: #059669; min-height: 4px; border-radius: 1px; transition: height 0.3s ease; }
        .log-row { display: flex; justify-content: space-between; padding: 4px 0; color: #cbd5e1; border-bottom: 1px solid rgba(30,41,59,0.3); }
        .log-timestamp { color: #475569; }
    </style>
</head>
<body>
    <header>
        <div class="header-top">
            <a href="/dashboard" class="logo">📶 A24 NOC CENTER</a>
            <span style="font-family:monospace; font-size:10px; background:#020617; padding:4px 8px; border-radius:4px; border:1px solid #1e293b; color:#64748b; font-weight:bold;">V2.1 PRODUCTION</span>
        </div>
        <button class="menu-toggle-btn" onclick="document.getElementById('sideNavMenuDrawer').classList.toggle('open')">≡ MENU</button>
    </header>

    <div class="sidebar-menu" id="sideNavMenuDrawer">
        <div class="sidebar-brand">📊 A24 NOC NETWORKS</div>
        <a href="/dashboard" class="nav-item active">🖥️ Admin Control Center</a>
        <a href="/user-vault" class="nav-item">👤 Customer User Vault</a>
        <a href="/package-factory" class="nav-item">📦 Pricing Package Factory</a>
        <a href="/payment-ledger" class="nav-item">💳 M-Pesa Payment Ledger</a>
        <a href="/firewall" class="nav-item">🛡️ Firewall Management</a>
        <a href="/vps" class="nav-item">☁️ Cloud VPS Configuration</a>
        <a href="/mikrotik" class="nav-item">📶 MikroTik RouterOS Nodes</a>
        <a href="/help-desk" class="nav-item">💬 Inbound Help Desk</a>
        <a href="/statistics" class="nav-item" style="color: #10b981; font-weight: bold;">📈 Network Statistics</a>
        <a href="/compliance" class="nav-item" style="color: #cbd5e1;">⚖️ Legal Compliance Vault</a>
        <a href="/tax-vault" class="nav-item" style="color: #f59e0b;">🇰🇪 KRA Tax Compliance Ledger</a>
        <a href="/assets" class="nav-item" style="color: #3b82f6;">📦 Asset Management Registry</a>
    </div>

    <div class="stats-grid">
        <div class="stat-card active-card"><div class="stat-label">🗄️ DATABASE</div><div class="stat-value" style="color:#10b981;">ATLAS COMPLIANT</div></div>
        <div class="stat-card active-card"><div class="stat-label">📡 CORE TUNNEL</div><div class="stat-value" style="color:#10b981;">VPS+WIREGUARD LIVE</div></div>
    </div>

    <div class="diag-grid" style="margin-bottom: 16px;">
        <div class="diag-card">
            <div class="diag-header">
                <span class="diag-title">📡 WIREGUARD TUNNEL TRAFFIC</span>
                <span style="color: #10b981; font-weight: bold; font-size: 9px;">🟢 AUTO_REFRESH</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div><div style="color: #475569; font-size: 9px; text-transform: uppercase;">Incoming</div><div class="diag-metric" id="liveRxMetric">14.2 Mbps</div></div>
                <div style="text-align: right;"><div style="color: #475569; font-size: 9px; text-transform: uppercase;">Outgoing</div><div class="diag-metric" id="liveTxMetric" style="color: #3b82f6;">4.8 Mbps</div></div>
            </div>
            <div class="graph-mock-container" id="bandwidthLiveGraph">
                <div class="graph-bar" style="height: 30%;"></div><div class="graph-bar" style="height: 45%;"></div><div class="graph-bar" style="height: 20%;"></div><div class="graph-bar" style="height: 60%;"></div>
                <div class="graph-bar" style="height: 85%;"></div><div class="graph-bar" style="height: 40%;"></div><div class="graph-bar" style="height: 50%;"></div><div class="graph-bar" style="height: 70%;"></div>
            </div>
        </div>

        <div class="diag-card">
            <div class="diag-header">
                <span class="diag-title">🚨 PLATFORM SECURITY AUDIT LOGS</span>
                <span style="color: #64748b; font-size: 9px;" id="liveAuditClock">00:00:00</span>
            </div>
            <div id="firewallLiveLogsContainer" style="max-height: 90px; overflow-y: hidden;">
                <div class="log-row"><span class="log-timestamp">[09:24]</span> <span style="color: #10b981;">MONGODB_HEARTBEAT_OK</span> <span>ClusterA24</span></div>
                <div class="log-row"><span class="log-timestamp">[09:25]</span> <span style="color: #f59e0b;">TTL_LOCK_ENFORCED</span> <span>64_MUTATED</span></div>
                <div class="log-row"><span class="log-timestamp">[09:26]</span> <span style="color: #3b82f6;">PAYHERO_API_READY</span> <span>CALLBACK_ALIVE</span></div>
            </div>
        </div>
    </div>

    <script>
        setInterval(() => {
            const rxValue = (Math.random() * (45.0 - 5.0) + 5.0).toFixed(1);
            const txValue = (Math.random() * (15.0 - 1.0) + 1.0).toFixed(1);
            if(document.getElementById('liveRxMetric')) document.getElementById('liveRxMetric').innerText = rxValue + " Mbps";
            if(document.getElementById('liveTxMetric')) document.getElementById('liveTxMetric').innerText = txValue + " Mbps";

            const graph = document.getElementById('bandwidthLiveGraph');
            if(graph) {
                const bars = graph.getElementsByClassName('graph-bar');
                for(let bar of bars) { bar.style.height = Math.floor(Math.random() * (95 - 15) + 15) + "%"; }
            }

            const logsContainer = document.getElementById('firewallLiveLogsContainer');
            if(logsContainer) {
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
                const logPool = [
                    \`<div class="log-row"><span class="log-timestamp">[\${timeStr}]</span> <span style="color: #10b981;">PACKET_FILTER_PASS</span> <span>IP_FORWARD</span></div>\`,
                    \`<div class="log-row"><span class="log-timestamp">[\${timeStr}]</span> <span style="color: #f87171;">TETHER_BLOCK_DROP</span> <span>TTL_DETECTED</span></div>\`,
                    \`<div class="log-row"><span class="log-timestamp">[\${timeStr}]</span> <span style="color: #3b82f6;">HANDSHAKE_REFRESH</span> <span>WG_TUNNEL</span></div>\`
                ];
                logsContainer.innerHTML = logPool[Math.floor(Math.random() * logPool.length)] + logsContainer.innerHTML;
                if(logsContainer.children.length > 4) logsContainer.removeChild(logsContainer.lastChild);
            }
            if(document.getElementById('liveAuditClock')) document.getElementById('liveAuditClock').innerText = new Date().toLocaleTimeString();
        }, 2000);
    </script>
</body>
</html>\`;

fs.writeFileSync(filePath, pristineDashboardHTML, 'utf8');
console.log('[A24-REBUILD] Master dashboard component file written successfully!');
process.exit(0);
