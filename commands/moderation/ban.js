const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the guild')
    .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  name: 'ban',
  description: 'Ban a member',

  async executeSlash(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || `Banned by ${interaction.user.tag}`;
    await interaction.deferReply({ ephemeral: true });

    try {
      await interaction.guild.members.ban(target.id, { reason });
      await interaction.editReply({ content: `✅ **${target.tag}** has been banned. Reason: ${reason}` });
      // optional webhook/log
      logger.logAction && logger.logAction('ban', `${interaction.user.tag} (${interaction.user.id})`, `${target.tag} (${target.id})`, reason);
    } catch (err) {
      console.error('[ban] ', err);
      await interaction.editReply({ content: `❌ Unable to ban **${target.tag}**. ${err.message}` });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply('❌ You do not have permission to ban members.');
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || `Banned by ${message.author.tag}`;
    if (!member) return message.reply('❌ Please mention a member to ban.');
    try {
      await member.ban({ reason });
      message.channel.send(`✅ **${member.user.tag}** has been banned. Reason: ${reason}`);
      logger.logAction && logger.logAction('ban', `${message.author.tag} (${message.author.id})`, `${member.user.tag} (${member.id})`, reason);
    } catch (err) {
      console.error('[ban-prefix] ', err);
      message.channel.send('❌ Failed to ban the user: ' + err.message);
    }
  }
};
