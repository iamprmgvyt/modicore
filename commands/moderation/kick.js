const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the guild')
    .addUserOption(opt => opt.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  name: 'kick',
  description: 'Kick a member',

  async executeSlash(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || `Kicked by ${interaction.user.tag}`;
    await interaction.deferReply({ ephemeral: true });

    try {
      const member = await interaction.guild.members.fetch(target.id);
      await member.kick(reason);
      await interaction.editReply({ content: `✅ **${target.tag}** has been kicked. Reason: ${reason}` });
      logger.logAction && logger.logAction('kick', `${interaction.user.tag} (${interaction.user.id})`, `${target.tag} (${target.id})`, reason);
    } catch (err) {
      console.error('[kick] ', err);
      await interaction.editReply({ content: `❌ Unable to kick **${target.tag}**. ${err.message}` });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return message.reply('❌ You do not have permission to kick members.');
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || `Kicked by ${message.author.tag}`;
    if (!member) return message.reply('❌ Please mention a member to kick.');
    try {
      await member.kick(reason);
      message.channel.send(`✅ **${member.user.tag}** has been kicked. Reason: ${reason}`);
      logger.logAction && logger.logAction('kick', `${message.author.tag} (${message.author.id})`, `${member.user.tag} (${member.id})`, reason);
    } catch (err) {
      console.error('[kick-prefix] ', err);
      message.channel.send('❌ Failed to kick the user: ' + err.message);
    }
  }
};
