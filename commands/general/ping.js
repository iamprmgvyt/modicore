const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Check bot latency'),
  name: 'ping',

  async executeSlash(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
    await interaction.editReply({ content: `Pong — ${sent.createdTimestamp - interaction.createdTimestamp}ms` });
  },

  async executePrefix(message) {
    const t = Date.now();
    const m = await message.channel.send('Pinging...');
    await m.edit(`Pong — ${Date.now() - t}ms`);
  }
};
