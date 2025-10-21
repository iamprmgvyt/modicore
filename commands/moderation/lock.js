const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock this channel (prevent @everyone from sending messages)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  name: 'lock',

  async executeSlash(interaction) {
    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
      await interaction.reply({ content: '🔒 Channel locked.' });
    } catch (err) {
      console.error('[lock] ', err);
      await interaction.reply({ content: '❌ Failed to lock channel: ' + err.message, ephemeral: true });
    }
  },

  async executePrefix(message) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('❌ You do not have permission to manage channels.');
    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      message.reply('🔒 Channel locked.');
    } catch (err) {
      console.error('[lock-prefix] ', err);
      message.reply('❌ Failed to lock channel: ' + err.message);
    }
  }
};
