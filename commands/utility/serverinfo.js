const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Show information about this server'),
  name: 'serverinfo',

  async executeSlash(interaction) {
    const g = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle(g.name)
      .setThumbnail(g.iconURL({ extension: 'png', size: 512 }))
      .addFields(
        { name: 'ID', value: `${g.id}`, inline: true },
        { name: 'Owner', value: `${(await g.fetchOwner()).user.tag}`, inline: true },
        { name: 'Member count', value: `${g.memberCount}`, inline: true }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message) {
    const g = message.guild;
    const embed = new EmbedBuilder()
      .setTitle(g.name)
      .setThumbnail(g.iconURL({ extension: 'png', size: 512 }))
      .addFields(
        { name: 'ID', value: `${g.id}`, inline: true },
        { name: 'Owner', value: `${(await g.fetchOwner()).user.tag}`, inline: true },
        { name: 'Member count', value: `${g.memberCount}`, inline: true }
      )
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });
  }
};
