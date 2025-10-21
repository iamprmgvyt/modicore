// deploy-commands.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');


const clientId = process.env.CLIENT_ID;
const token = process.env.BOT_TOKEN;
if (!clientId || !token) throw new Error('CLIENT_ID and BOT_TOKEN required');


const commands = [];
const commandDirs = fs.readdirSync('./commands');
for (const dir of commandDirs) {
const files = fs.readdirSync(`./commands/${dir}`).filter(f => f.endsWith('.js'));
for (const file of files) {
const cmd = require(`./commands/${dir}/${file}`);
if (cmd.data) commands.push(cmd.data.toJSON());
}
}


const rest = new REST({ version: '10' }).setToken(token);
(async () => {
try {
console.log('[deploy] Registering global commands...');
await rest.put(Routes.applicationCommands(clientId), { body: commands });
console.log('[deploy] Global commands registered. Note: global commands can take up to 1 hour to propagate.');
} catch (err) {
console.error(err);
}
})();