// models/GuildConfig.js
const { Schema, model } = require('mongoose');


const schema = new Schema({
guildId: { type: String, required: true, unique: true },
prefix: { type: String, default: process.env.PREFIX || '!' },
modLogChannelId: { type: String, default: null }
}, { timestamps: true });


module.exports = model('GuildConfig', schema);