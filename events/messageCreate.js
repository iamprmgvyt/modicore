// events/messageCreate.js
const GuildConfig = require('../models/GuildConfig');
module.exports = {
name: 'messageCreate',
async execute(message) {
if (message.author.bot || !message.guild) return;
const gcfg = await GuildConfig.findOne({ guildId: message.guild.id }) || { prefix: process.env.PREFIX || '!' };
const prefix = gcfg.prefix || process.env.PREFIX || '!';
if (!message.content.startsWith(prefix)) return;
const args = message.content.slice(prefix.length).trim().split(/\s+/);
const cmdName = args.shift().toLowerCase();
const cmd = message.client.commands.get(cmdName);
if (!cmd || !cmd.executePrefix) return;
try {
await cmd.executePrefix(message, args);
} catch (err) {
console.error('[prefix] ', err);
message.reply('Error executing command');
}
}
};