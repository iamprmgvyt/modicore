const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const MuteModel = require('../../models/Mute');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmute a member early')
    .addUserOption(opt => opt.setName('user').setDescription('User to unmute').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  name: 'unmute',

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    await interaction.deferReply({ ephemeral: true });
    try {
      const guild = interaction.guild;
      const member = await guild.members.fetch(user.id).catch(() => null);
      const role = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
      if (member && role && member.roles.cache.has(role.id)) {
        await member.roles.remove(role, `Unmuted by ${interaction.user.tag}`);
      }
      await MuteModel.deleteMany({ guildId: guild.id, userId: user.id });
      await interaction.editReply({ content: `✅ **${user.tag}** has been unmuted.` });
      logger.logAction && logger.logAction('unmute', `${interaction.user.tag} (${interaction.user.id})`, `${user.tag} (${user.id})`, 'Manual unmute');
    } catch (err) {
      console.error('[unmute] ', err);
      await interaction.editReply({ content: '❌ Failed to unmute: ' + err.message });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply('❌ You do not have permission to unmute members.');
    const member = message.mentions.members.first();
    if (!member) return message.reply('❌ Please mention someone to unmute.');
    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
    try {
      if (role && member.roles.cache.has(role.id)) await member.roles.remove(role, `Unmuted by ${message.author.tag}`);
      await MuteModel.deleteMany({ guildId: message.guild.id, userId: member.id });
      message.channel.send(`✅ **${member.user.tag}** has been unmuted.`);
      logger.logAction && logger.logAction('unmute', `${message.author.tag} (${message.author.id})`, `${member.user.tag} (${member.id})`, 'Manual unmute');
    } catch (err) {
      console.error('[unmute-prefix] ', err);
      message.channel.send('❌ Failed to unmute: ' + err.message);
    }
  }
};
