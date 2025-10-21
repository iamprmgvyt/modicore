const { WebhookClient, EmbedBuilder } = require('discord.js');


module.exports = {
logAction: async (action, moderator, target, reason) => {
const webhookUrl = process.env.LOG_WEBHOOK;
if (!webhookUrl) return;
const wh = new WebhookClient({ url: webhookUrl });
const embed = new EmbedBuilder()
.setTitle(`🔔 ${action.toUpperCase()}`)
.setDescription(`**Moderator:** ${moderator}\n**Target:** ${target}\n**Reason:** ${reason}`)
.setColor(action === 'ban' ? 0xff0000 : 0xffc107)
.setTimestamp();
await wh.send({ embeds: [embed] });
}
};