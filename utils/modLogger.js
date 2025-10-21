// utils/modLogger.js
const Warn = require('../models/Warn');
const { modEmbed } = require('./embedBuilder');


// punishment rules: when warn count reaches threshold -> action
const PUNISHMENT_RULES = [
{ warns: 3, action: 'mute', durationMinutes: 60 },
{ warns: 5, action: 'kick' },
{ warns: 7, action: 'ban' }
];


async function addWarn(guildId, userId, moderatorId, reason) {
const warn = await Warn.create({ guildId, userId, moderatorId, reason });
const count = await Warn.countDocuments({ guildId, userId });
return { warn, count };
}


function checkPunishment(count) {
// find highest rule where warns <= count
for (let i = PUNISHMENT_RULES.length - 1; i >= 0; i--) {
if (count >= PUNISHMENT_RULES[i].warns) return PUNISHMENT_RULES[i];
}
return null;
}


module.exports = { addWarn, checkPunishment, PUNISHMENT_RULES };