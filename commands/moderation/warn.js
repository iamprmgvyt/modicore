const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warn = require('../../models/Warn');
const { addWarn, checkPunishment, PUNISHMENT_RULES } = require('../../utils/modLogger');
const logger = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a member')
    .addUserOption(o => o.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  name: 'warn',

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    await interaction.deferReply({ ephemeral: false });

    try {
      const { warn, count } = await addWarn(interaction.guild.id, user.id, interaction.user.id, reason);
      await interaction.editReply({ content: `⚠️ **${user.tag}** warned. Total warns: ${count}` });
      logger.logAction && logger.logAction('warn', `${interaction.user.tag} (${interaction.user.id})`, `${user.tag} (${user.id})`, reason);

      const punish = checkPunishment(count);
      if (punish) {
        // apply punishment according to rule
        if (punish.action === 'mute') {
          // mute for punish.durationMinutes if provided
          const muteCmd = interaction.client.commands.get('mute');
          if (muteCmd && muteCmd.executeSlash) {
            // call mute command programmatically for auto-punish
            // create a pseudo interaction-like object is complex; instead inform mods
            await interaction.followUp({ content: `Auto punishment triggered: ${punish.action} (${punish.durationMinutes || 'n/a'} minutes). Please apply manually or use /mute.` });
          }
        } else {
          await interaction.followUp({ content: `Auto punishment triggered: ${punish.action}. Please apply manually.` });
        }
      }
    } catch (err) {
      console.error('[warn] ', err);
      await interaction.editReply({ content: '❌ Failed to warn: '+err.message });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return message.reply('❌ You do not have permission to warn members.');
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Please mention a user to warn.');
    const reason = args.slice(1).join(' ') || 'No reason provided';
    const { warn, count } = await addWarn(message.guild.id, user.id, message.author.id, reason);
    message.channel.send(`⚠️ **${user.tag}** warned. Total warns: ${count}`);
    logger.logAction && logger.logAction('warn', `${message.author.tag} (${message.author.id})`, `${user.tag} (${user.id})`, reason);
  }
};
