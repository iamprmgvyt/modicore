const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show information about a user')
    .addUserOption(o => o.setName('user').setDescription('User to inspect').setRequired(false)),

  name: 'userinfo',

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 512 }))
      .addFields(
        { name: 'ID', value: `${user.id}`, inline: true },
        { name: 'Bot', value: `${user.bot}`, inline: true },
        { name: 'Joined Server', value: member ? `${member.joinedAt}` : 'N/A', inline: true }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },

  async executePrefix(message) {
    const user = message.mentions.users.first() || message.author;
    const member = await message.guild.members.fetch(user.id).catch(() => null);
    const embed = new EmbedBuilder()
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 512 }))
      .addFields(
        { name: 'ID', value: `${user.id}`, inline: true },
        { name: 'Bot', value: `${user.bot}`, inline: true },
        { name: 'Joined Server', value: member ? `${member.joinedAt}` : 'N/A', inline: true }
      )
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });
  }
};
