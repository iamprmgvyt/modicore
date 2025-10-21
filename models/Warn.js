// models/Warn.js
const { Schema, model } = require('mongoose');


const schema = new Schema({
guildId: String,
userId: String,
moderatorId: String,
reason: String,
createdAt: { type: Date, default: Date.now }
});


module.exports = model('Warn', schema);