const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dashboard.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Overwrite the header layout css blocks to support a full-width vertical column layout stack
const oldStyles = `header { background-color: rgba(15, 23, 42, 0.95); border-bottom: 1px solid #1e293b; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); width: 100%; }
        .logo-box { display: flex; align-items: center; gap: 12px; width: 100%; }`;

const stackedHeaderStyles = `header { background-color: rgba(15, 23, 42, 0.95); border-bottom: 1px solid #1e293b; min-height: 110px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: 14px 16px; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); width: 100%; }
        .logo-box { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; width: 100%; }`;

content = content.replace(oldStyles, stackedHeaderStyles);

// 2. Adjust the sidebar height subtraction rule so the menu scrolls correctly on mobile viewports
content = content.replace("height: calc(100vh - 64px);", "height: calc(100vh - 110px);");
content = content.replace("top: 64px;", "top: 110px;");
content = content.replace("min-height: calc(100vh - 64px);", "min-height: calc(100vh - 110px);");

// 3. Re-structure the HTML elements so the company name is placed strictly on top of the hamburger button
const oldHtmlLayout = `<div class="logo-box" style="display: flex; align-items: center; gap: 12px;">
            <button id="menuToggleBtn" class="hamburger-btn" style="margin-right: 4px;">≡</button>
            <div class="brand-text" style="display: inline-block;">A24<span class="noc-badge" style="margin-left: 4px;">NOC</span></div>
        </div>`;

const stackedHtmlLayout = `<div class="logo-box">
            <!-- 🏢 Company Name sits proudly on top -->
            <div class="brand-text" style="font-size: 22px; width: 100%; display: block; border-bottom: 1px solid #111827; padding-bottom: 6px;">A24 <span class="noc-badge" style="font-size: 12px; color: #10b981;">NOC CENTER</span></div>
            <!-- ≡ Hamburger button sits underneath -->
            <button id="menuToggleBtn" class="hamburger-btn">≡</button>
        </div>`;

content = content.replace(oldHtmlLayout, stackedHtmlLayout);

fs.writeFileSync(filePath, content, 'utf8');
console.log('[A24-REPAIR] Success! Company Name structured on top of the hamburger button.');
process.exit(0);
