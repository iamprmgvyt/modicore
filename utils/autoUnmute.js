const Mute = require('../models/Mute');


module.exports = async (client) => {
setInterval(async () => {
const now = Date.now();
const mutes = await Mute.find({ endAt: { $lte: now } });
for (const mute of mutes) {
const guild = client.guilds.cache.get(mute.guildId);
if (!guild) continue;
const member = await guild.members.fetch(mute.userId).catch(() => null);
if (member) {
const role = guild.roles.cache.find(r => r.name === 'Muted');
if (role && member.roles.cache.has(role.id)) {
await member.roles.remove(role);
console.log(`✅ Auto-unmuted ${member.user.tag}`);
}
}
await Mute.deleteOne({ _id: mute._id });
}
}, 60000); // check every minute
};