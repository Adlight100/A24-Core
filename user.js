const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    userId: {
            type: String,
                    unique: true,
                            default: () => 'A24-ID-' + Math.floor(100000 + Math.random() * 900000)
                                },
                                    name: {
                                            type: String,
                                                    required: true
                                                        },
                                                            username: {
                                                                    type: String,
                                                                            required: true,
                                                                                    unique: true,
                                                                                            lowercase: true,
                                                                                                    trim: true
                                                                                                        },
                                                                                                            password: {
                                                                                                                    type: String,
                                                                                                                            required: true
                                                                                                                                },
                                                                                                                                    lockedIP: {
                                                                                                                                            type: String,
                                                                                                                                                    default: null
                                                                                                                                                        },
                                                                                                                                                            status: {
                                                                                                                                                                    type: String,
                                                                                                                                                                            enum: ['active', 'disabled'],
                                                                                                                                                                                    default: 'disabled'
                                                                                                                                                                                        },
                                                                                                                                                                                            tierName: {
                                                                                                                                                                                                    type: String,
                                                                                                                                                                                                            default: 'None'
                                                                                                                                                                                                                },
                                                                                                                                                                                                                    expirationTime: {
                                                                                                                                                                                                                            type: Date,
                                                                                                                                                                                                                                    default: null
                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                            v2rayConfigLink: {
                                                                                                                                                                                                                                                    type: String,
                                                                                                                                                                                                                                                            default: null
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                }, { timestamps: true });

                                                                                                                                                                                                                                                                UserSchema.pre('save', async function(next) {
                                                                                                                                                                                                                                                                    if (!this.isModified('password')) return next();
                                                                                                                                                                                                                                                                        const salt = await bcrypt.genSalt(10);
                                                                                                                                                                                                                                                                            this.password = await bcrypt.hash(this.password, salt);
                                                                                                                                                                                                                                                                                next();
                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                module.exports = mongoose.model('User', UserSchema);