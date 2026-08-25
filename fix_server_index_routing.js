const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server.js');
let content = fs.readFileSync(filePath, 'utf8');

// Unify all customer routes to securely serve index.html directly
content = content.replaceAll("res.sendFile(path.join(__dirname, 'store.html'))", "res.sendFile(path.join(__dirname, 'index.html'))");

fs.writeFileSync(filePath, content, 'utf8');
print('✅ Server routing mapped to index.html perfectly!');
process.exit(0);
