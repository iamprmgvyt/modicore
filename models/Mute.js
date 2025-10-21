const { Schema, model } = require('mongoose');
const MuteSchema = new Schema({ guildId: String, userId: String, endAt: Number });
module.exports = model('Mute', MuteSchema);