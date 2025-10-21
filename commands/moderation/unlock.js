const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  name: 'unlock',

  async executeSlash(interaction) {
    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
      await interaction.reply({ content: '🔓 Channel unlocked.' });
    } catch (err) {
      console.error('[unlock] ', err);
      await interaction.reply({ content: '❌ Failed to unlock channel: ' + err.message, ephemeral: true });
    }
  },

  async executePrefix(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('❌ You do not have permission to manage channels.');
    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
      message.reply('🔓 Channel unlocked.');
    } catch (err) {
      console.error('[unlock-prefix] ', err);
      message.reply('❌ Failed to unlock channel: ' + err.message);
    }
  }
};
