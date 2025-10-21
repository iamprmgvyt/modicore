const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('status').setDescription('Show bot status'),
  name: 'status',

  async executeSlash(interaction) {
    const client = interaction.client;
    const guilds = client.guilds.cache.size;
    const uptimeSec = Math.floor(client.uptime / 1000);
    await interaction.reply({ content: `Guilds: ${guilds}\nUptime(s): ${uptimeSec}` });
  },

  async executePrefix(message) {
    const client = message.client;
    message.channel.send(`Guilds: ${client.guilds.cache.size}\nUptime(s): ${Math.floor(client.uptime/1000)}`);
  }
};
