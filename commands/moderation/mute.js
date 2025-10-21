const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const MuteModel = require('../../models/Mute');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member for a number of minutes')
    .addUserOption(opt => opt.setName('user').setDescription('User to mute').setRequired(true))
    .addIntegerOption(opt => opt.setName('minutes').setDescription('Duration in minutes').setRequired(false))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  name: 'mute',
  description: 'Mute a member',

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const minutes = interaction.options.getInteger('minutes') || 60;
    const reason = interaction.options.getString('reason') || `Muted by ${interaction.user.tag}`;
    await interaction.deferReply({ ephemeral: false });

    try {
      const guild = interaction.guild;
      let role = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
      if (!role) {
        role = await guild.roles.create({ name: 'Muted', permissions: [] });
      }
      // apply channel overwrites to prevent speaking/sending
      for (const ch of guild.channels.cache.values()) {
        try {
          await ch.permissionOverwrites.edit(role, { SendMessages: false, AddReactions: false, Speak: false }, { reason: 'Create muted role' });
        } catch(e) { /* ignore */ }
      }

      const member = await guild.members.fetch(user.id);
      await member.roles.add(role, reason);

      const expiresAt = Date.now() + minutes * 60000;
      await MuteModel.create({ guildId: guild.id, userId: user.id, endAt: expiresAt });

      await interaction.editReply({ content: `🔇 **${user.tag}** muted for ${minutes} minutes. Reason: ${reason}` });
      logger.logAction && logger.logAction('mute', `${interaction.user.tag} (${interaction.user.id})`, `${user.tag} (${user.id})`, reason);
    } catch (err) {
      console.error('[mute] ', err);
      await interaction.editReply({ content: `❌ Failed to mute: ${err.message}` });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply('❌ You do not have permission to mute members.');
    const member = message.mentions.members.first();
    const minutes = parseInt(args[1]) || 60;
    const reason = args.slice(2).join(' ') || `Muted by ${message.author.tag}`;
    if (!member) return message.reply('❌ Please mention someone to mute.');

    try {
      let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
      if (!role) role = await message.guild.roles.create({ name: 'Muted', permissions: [] });
      for (const ch of message.guild.channels.cache.values()) {
        try { await ch.permissionOverwrites.edit(role, { SendMessages: false, AddReactions: false, Speak: false }, { reason: 'Create muted role' }); } catch(e) {}
      }
      await member.roles.add(role, reason);
      await MuteModel.create({ guildId: message.guild.id, userId: member.id, endAt: Date.now() + minutes * 60000 });
      message.channel.send(`🔇 **${member.user.tag}** muted for ${minutes} minutes. Reason: ${reason}`);
      logger.logAction && logger.logAction('mute', `${message.author.tag} (${message.author.id})`, `${member.user.tag} (${member.id})`, reason);
    } catch (err) {
      console.error('[mute-prefix] ', err);
      message.channel.send('❌ Failed to mute: ' + err.message);
    }
  }
};
