// events/interactionCreate.js
module.exports = {
name: 'interactionCreate',
async execute(interaction) {
if (!interaction.isChatInputCommand()) return;
const command = interaction.client.commands.get(interaction.commandName);
if (!command) return;
try {
await command.executeSlash(interaction);
} catch (err) {
console.error('[slash] ', err);
if (interaction.deferred || interaction.replied) await interaction.editReply({ content: 'Error while running command', ephemeral: true });
else await interaction.reply({ content: 'Error while running command', ephemeral: true });
}
}
};