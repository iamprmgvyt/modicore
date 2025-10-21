// utils/embedBuilder.js
const { EmbedBuilder } = require('discord.js');


function modEmbed({ title, description, color }) {
return new EmbedBuilder()
.setTitle(title)
.setDescription(description)
.setTimestamp()
.setColor(color || Math.floor(Math.random()*16777215));
}


module.exports = { modEmbed };