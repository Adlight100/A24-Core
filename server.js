const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const { User, Tier, Notification, Settings } = require('./models');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🗄️ CONNECT TO YOUR ACTIVE MONGODB CLUSTER A24
const mongoURI = "mongodb+srv://enockchepkwony88_db_user:eSQh4nZFPuHV8H6Z@clustera24.bbf1rde.mongodb.net/a24_database?retryWrites=true&w=majority&appName=ClusterA24";
mongoose.connect(mongoURI)
    .then(() => console.log('[A24-DATABASE] Successfully connected to your MongoDB ClusterA24!'))
    .catch(err => console.error(`[A24-DATABASE-ERROR] Connection Failed: ${err.message}`));

// 🖥️ BULLETPROOF CATCH-ALL ROUTING LINK LINKS
app.get('/', (req, res) => res.redirect('/dashboard'));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/store', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/user-vault', (req, res) => res.sendFile(path.join(__dirname, 'user-vault.html')));
app.get('/package-factory', (req, res) => res.sendFile(path.join(__dirname, 'package-factory.html')));
app.get('/payment-ledger', (req, res) => res.sendFile(path.join(__dirname, 'payment-ledger.html')));
app.get('/firewall', (req, res) => res.sendFile(path.join(__dirname, 'firewall.html')));
app.get('/vps', (req, res) => res.sendFile(path.join(__dirname, 'vps.html')));
app.get('/mikrotik', (req, res) => res.sendFile(path.join(__dirname, 'mikrotik.html')));
app.get('/help-desk', (req, res) => res.sendFile(path.join(__dirname, 'help-desk.html')));
app.get('/app-apk', (req, res) => res.sendFile(path.join(__dirname, 'apk-simulator.html')));
app.get('/statistics', (req, res) => res.sendFile(path.join(__dirname, 'statistics.html')));
app.get('/compliance', (req, res) => res.sendFile(path.join(__dirname, 'compliance.html')));
app.get('/assets', (req, res) => res.sendFile(path.join(__dirname, 'assets.html')));
app.get('/tax-vault', (req, res) => res.sendFile(path.join(__dirname, 'tax-vault.html')));

// ==========================================
// 📡 REAL-TIME OPERATIONAL API LAYER
// ==========================================
app.get('/api/v1/system-stats', async (req, res) => {
    try {
        const activeTunnels = await User.countDocuments({ status: 'active' });
        res.status(200).json({ revenue: 0, activeTunnels: activeTunnels });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/v1/settings', async (req, res) => {
    try {
        const config = await Settings.findOne({ key: "global_config" });
        res.status(200).json(config);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/v1/settings/update', async (req, res) => {
    try {
        const updates = req.body;
        const config = await Settings.findOneAndUpdate({ key: "global_config" }, updates, { new: true });
        res.status(200).json({ success: true, config });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/api/v1/users', async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/v1/users/register', async (req, res) => {
    try {
        const targetUsername = req.body.username;
        if (!targetUsername) return res.status(200).json({ success: false, error: "Username required." });
        const cleanName = targetUsername.toLowerCase().trim();
        let user = await User.findOne({ username: cleanName });
        if (!user) {
            user = new User({ username: cleanName, status: 'disabled' });
            await user.save();
        }
        return res.status(200).json({ success: true, user });
    } catch (err) { return res.status(200).json({ success: false, error: err.message }); }
});
app.get('/api/v1/users/status/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username.toLowerCase() });
        if(!user) return res.status(404).json({ status: 'disconnected' });
        res.status(200).json({ status: user.status === 'active' ? 'connected' : 'disconnected', user });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/v1/users/toggle-status', async (req, res) => {
    try {
        const { username, status } = req.body;
        await User.findOneAndUpdate({ username }, { status });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/v1/users/delete/:username', async (req, res) => {
    try {
        await User.findOneAndDelete({ username: req.params.username });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/v1/tiers', async (req, res) => {
    try {
        const tiers = await Tier.find({});
        res.status(200).json(tiers);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/v1/tiers/create', async (req, res) => {
    try {
        const { name, duration, price, isFlash } = req.body;
        const key = 'custom-' + Math.floor(Math.random() * 10000);
        const newTier = new Tier({ key, name, duration, price, isFlash, status: 'OPEN' });
        await newTier.save();
        res.status(200).json({ success: true, tier: newTier });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/v1/tiers/toggle-lock', async (req, res) => {
    try {
        const { key, status } = req.body;
        await Tier.findOneAndUpdate({ key }, { status });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/v1/tiers/delete/:key', async (req, res) => {
    try {
        await Tier.findOneAndDelete({ key: req.params.key });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/v1/notifications', async (req, res) => {
    try {
        const alerts = await Notification.find({}).sort({ createdAt: -1 });
        res.status(200).json(alerts);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
// ==========================================
// 💳 PRODUCTION LIVE PAYHERO MPESA INTEGRATION (AXIOS DRIVEN)
// ==========================================
app.post('/api/v1/initialize-stk', async (req, res) => {
    try {
        const { username, phone, amount } = req.body;
        
        let formattedPhone = phone.trim().replace(/\+/g, '');
        if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);
        else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) formattedPhone = '254' + formattedPhone;

        console.log(`[PAYHERO] Packaging network invoice for ${username}. KSh ${amount} ➡️ ${formattedPhone}`);

        // ⚠️ CRITICAL STEP: Paste your real keys INSIDE these double quotes parameters!
        const payheroUsername = "0jc2YLCMln35ZTvRJqzS"; 
        const payheroPassword = "EPMcCWx85uUwXkRzoCYixwqxLE7akMcQ5yaNymPB";
        const channelId = "11277"; 

        const payheroUrl = "https://payhero.co.ke";
        const authHeader = "Basic " + Buffer.from(`${payheroUsername}:${payheroPassword}`).toString('base64');

        const payload = {
            "amount": amount.toString(),
            "phone_number": formattedPhone.toString(),
            "channel_id": channelId.toString(), 
            "provider": "m-pesa",
            "external_reference": `A24-${username.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            "callback_url": "https://github.dev"
        };

        console.log(`[PAYHERO-AXIOS] Dispatching cryptographic transaction packet payload...`);
        
        const response = await axios.post(payheroUrl, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader
            },
            timeout: 10000,
            validateStatus: function (status) { return status < 500; }
        });

        console.log('[PAYHERO-SERVER-RAW-RESPONSE-STATUS]', response.status);
        console.log('[PAYHERO-SERVER-RAW-RESPONSE-BODY]', JSON.stringify(response.data));

        if (response.status === 200 || response.status === 201) {
            const responseData = response.data;
            if (responseData.status === 'success' || responseData.success === true || responseData.response_code === "0") {
                return res.status(200).json({ 
                    success: true, 
                    message: "STK Prompt successfully dispatched to subscriber lock screen.",
                    reference: responseData.reference || payload.external_reference,
                    phone: formattedPhone
                });
            }
        }

        const errorDetails = response.data && typeof response.data === 'object' ? (response.data.message || response.data.error) : "Invalid Account Credentials API Keys";
        return res.status(200).json({ 
            success: false, 
            error: `Gateway Error [HTTP-${response.status}]: ${errorDetails}. Please verify your Till Number and Password entries inside server.js.` 
        });

    } catch (err) {
        console.error('[PAYHERO-AXIOS-CRASH]', err.message);
        return res.status(200).json({ success: false, error: "Network fetch route failure: Gateway dropped connection streams." });
    }
});
app.post('/api/v1/payhero-callback', async (req, res) => {
    console.log('[PAYHERO-WEBHOOK-CALLBACK-RECEIVED]', JSON.stringify(req.body));
    res.status(200).send("CALLBACK_SETTLED");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`[A24-LITE] Core Engine Active on System Port ${PORT}`));
