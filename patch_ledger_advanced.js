const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'payment-ledger.html');

const fullLedgerCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A24 NOC - Payment Ledger</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #060913; color: #cbd5e1; padding: 16px; min-height: 100vh; padding-bottom: 40px; }
        header { background-color: #090d1a; border: 1px solid #1e293b; padding: 14px; border-radius: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 18px; font-weight: bold; color: #10b981; text-transform: uppercase; text-decoration: none; }
        .back-btn { background: #0f172a; border: 1px solid #334155; color: #10b981; font-size: 11px; padding: 8px 14px; border-radius: 6px; cursor: pointer; text-decoration: none; font-weight: bold; text-transform: uppercase; }
        
        .card { background: #0f172a; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
        .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 14px; font-family: monospace; tracking: 0.05em; }
        
        /* Search Box Elements */
        .search-container { display: flex; gap: 8px; margin-bottom: 14px; }
        input { width: 100%; height: 40px; background: #020617; border: 1px solid #1e293b; border-radius: 6px; color: white; padding: 0 12px; font-size: 13px; outline: none; }
        input:focus { border-color: #10b981; }
        
        .action-btn { height: 40px; background: #0f172a; border: 1px solid #334155; color: #cbd5e1; font-size: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; text-transform: uppercase; display: flex; align-items: center; justify-content: center; padding: 0 12px; }
        .action-btn.danger { color: #f87171; border-color: rgba(239, 68, 68, 0.2); }
        .action-btn.danger:hover { background: rgba(239, 68, 68, 0.05); }
        
        /* Ledger Record Rows mapping */
        .ledger-row { background: #020617; border: 1px solid #0f172a; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px; font-family: monospace; }
        .ledger-row:last-child { margin-bottom: 0; }
        
        /* Status Badge Matrices */
        .status-badge { font-size: 10px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; display: inline-block; text-align: center; min-width: 75px; }
        .status-pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
        .status-connected { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
        .right-rack { display: flex; align-items: center; gap: 10px; }
        .empty-state { text-align: center; padding: 30px 14px; color: #475569; font-family: monospace; font-size: 11px; font-weight: bold; border: 1px dashed #1e293b; border-radius: 8px; }
    </style>
</head>
<body>
    <header>
        <a href="/dashboard" class="logo">A24 CENTRAL LEDGER</a>
        <a href="/dashboard" class="back-btn">⬅️ Back Home</a>
    </header>

    <div class="card">
        <div class="section-title">📜 PayHero Kenya Transaction Stream</div>
        
        <!-- 🔍 DYNAMIC TRANSACTION FILTER ENGINE -->
        <div class="search-container">
            <input type="text" id="ledgerSearchInput" placeholder="Search by username or transaction reference..." />
            <button class="action-btn" onclick="executeLedgerSearch()">🔍 Filter</button>
        </div>

        <div id="ledgerRowsRack">
            <!-- Mock Invoice Row 1: Paid but User is not connected automatically -->
            <div class="ledger-row" id="log-A24-trial_user-4891">
                <div>
                    <div>Ref: <b class="ref-text">A24-trial_user-4891</b></div>
                    <div style="color:#64748b; font-size:9px; margin-top:2px;">💰 Hours Pass // Value: KSh 20 // Client Offline</div>
                </div>
                <div class="right-rack">
                    <span class="status-badge status-pending" id="badge-A24-trial_user-4891">PENDING</span>
                    <button class="action-btn danger" onclick="deleteLedgerRecord('log-A24-trial_user-4891', 'A24-trial_user-4891')">🗑️</button>
                </div>
            </div>

            <!-- Mock Invoice Row 2: Paid and Session Link Is Connected -->
            <div class="ledger-row" id="log-A24-urban_client-1142">
                <div>
                    <div>Ref: <b class="ref-text">A24-urban_client-1142</b></div>
                    <div style="color:#64748b; font-size:9px; margin-top:2px;">💰 Days Pass // Value: KSh 50 // Interface Live</div>
                </div>
                <div class="right-rack">
                    <span class="status-badge status-connected">CONNECTED</span>
                    <button class="action-btn danger" onclick="deleteLedgerRecord('log-A24-urban_client-1142', 'A24-urban_client-1142')">🗑️</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 🔍 Real-Time Input Query Filtering Matrix
        function executeLedgerSearch() {
            const query = document.getElementById('ledgerSearchInput').value.trim().toLowerCase();
            const rows = document.querySelectorAll('#ledgerRowsRack .ledger-row');
            let visibleCount = 0;

            rows.forEach(row => {
                const textRef = row.querySelector('.ref-text').innerText.toLowerCase();
                if (textRef.includes(query)) {
                    row.style.display = 'flex';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            const rack = document.getElementById('ledgerRowsRack');
            const placeholder = document.getElementById('ledgerPlaceholderState');
            if (visibleCount === 0 && !placeholder) {
                rack.insertAdjacentHTML('beforeend', `<div id=\"ledgerPlaceholderState\" class=\"empty-state\">[ NO TRANSACTION INVOICES FOUND MATCHING SEARCH ]</div>`);
            } else if (visibleCount > 0 && placeholder) {
                placeholder.remove();
            }
        }

        // Auto-fire query filters while the admin is typing on mobile keys
        document.getElementById('ledgerSearchInput').addEventListener('input', executeLedgerSearch);

        // 🗑️ Permanent Transaction Invoice Excision
        function deleteLedgerRecord(rowId, refCode) {
            if (confirm(`🗑️ DELETION ALERT: Are you sure you want to permanently delete transaction record [ ${refCode} ] from active dashboard buffers?`)) {
                const element = document.getElementById(rowId);
                if (element) {
                    element.remove();
                    alert(`Invoice record [ ${refCode} ] dropped from system logs.`);
                    
                    // Verify if list is completely bare
                    const remainingRows = document.querySelectorAll('#ledgerRowsRack .ledger-row');
                    if (remainingRows.length === 0) {
                        document.getElementById('ledgerRowsRack').innerHTML = `<div class=\"empty-state\">[ NO TRANSACTION INVOICES RECORDED ]</div>`;
                    }
                }
            }
        }
    </script>
</body>
</html>`;

fs.writeFileSync(filePath, fullLedgerCode, 'utf8');
console.log('[A24-SYSTEM] Payment Ledger successfully updated with search, delete, and pending state tracking flags!');
process.exit(0);
