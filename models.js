const mongoose = require('mongoose');

// 👤 Client Accounts Blueprint
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    lockedIP: { type: String, default: null },
    status: { type: String, enum: ['active', 'disabled'], default: 'disabled' },
    tierName: { type: String, default: 'None' },
    expirationTime: { type: Date, default: null }
}, { timestamps: true });

// ⏳ Internet Pass Tier Options Blueprint
const TierSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['OPEN', 'LOCKED'], default: 'OPEN' },
    isFlash: { type: Boolean, default: false }
});

// 📢 Broadcast System Advisories Blueprint
const NotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

// 🛠️ Dynamic Admin Configurations Blueprint
const SettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: "global_config" },
    apkDownloadLink: { type: String, default: "https://github.dev" },
    portalShareLink: { type: String, default: "https://github.dev" },
    supportWhatsAppNumber: { type: String, default: "254700000000" },
    supportWhatsAppLink: { type: String, default: "https://wa.me" },
    supportCallNumber: { type: String, default: "+254700000000" }
});

module.exports = {
    User: mongoose.model('Subscriber', UserSchema),
    Tier: mongoose.model('Tier', TierSchema),
    Notification: mongoose.model('Notification', NotificationSchema),
    Settings: mongoose.model('Settings', SettingsSchema)
};
