const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Bulk delete messages in this channel')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Number of messages to delete (1-100)').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  name: 'clear',

  async executeSlash(interaction) {
    const amount = interaction.options.getInteger('amount');
    if (amount < 1 || amount > 100) return interaction.reply({ content: 'Amount must be between 1 and 100', ephemeral: true });
    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `🧹 Deleted ${deleted.size} messages.`, ephemeral: true });
    } catch (err) {
      console.error('[clear] ', err);
      await interaction.reply({ content: '❌ Failed to delete messages: ' + err.message, ephemeral: true });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply('❌ You do not have permission to delete messages.');
    const amount = parseInt(args[0]);
    if (!amount || amount < 1 || amount > 100) return message.reply('Amount must be between 1 and 100.');
    const deleted = await message.channel.bulkDelete(amount, true);
    message.reply(`🧹 Deleted ${deleted.size} messages.`);
  }
};
