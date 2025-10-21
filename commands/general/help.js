const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Show help for commands'),
  name: 'help',
  description: 'Show help',

  async executeSlash(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Moderation Bot — Help')
      .setDescription('Prefix commands supported with `!` and global slash commands `/`.')
      .addFields(
        { name: '/ban', value: 'Ban a member', inline: true },
        { name: '/kick', value: 'Kick a member', inline: true },
        { name: '/mute', value: 'Mute a member', inline: true },
        { name: '/unmute', value: 'Unmute a member', inline: true },
        { name: '/warn', value: 'Warn a member', inline: true },
        { name: '/clear', value: 'Bulk delete messages', inline: true }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },

  async executePrefix(message) {
    const embed = new EmbedBuilder()
      .setTitle('Moderation Bot — Help')
      .setDescription('Use slash commands or prefix `!` commands. Examples: `!ban @user`, `/ban`')
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });
  }
};
