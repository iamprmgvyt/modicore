require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Partials, Collection, ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const { autoUnmute } = require("./utils/autoUnmute");
const { logToWebhook } = require("./utils/modLogger");

// 🧠 Create Discord client
const client = new Client({ 
intents: [ 
GatewayIntentBits.Guilds, 
GatewayIntentBits.GuildMessages, 
GatewayIntentBits.GuildMembers, 
GatewayIntentBits.MessageContent, 
], 
partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
client.slashCommands = new Collection();

// 📁 Load prefix commands
const commandFolders = fs.readdirSync(path.join(__dirname, "commands"));
for (const folder of commandFolders) { 
const folderPath = path.join(__dirname, "commands", folder); 
const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".js")); 
for (const file of commandFiles) { 
const command = require(path.join(folderPath, file)); 
client.commands.set(command.name, command); 
}
}

// 📦 MongoDB connects
mongoose.connect(process.env.MONGODB_URI, { 
useNewUrlParser: true, 
useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB Error:", err));

// 📡 Event when bot goes online
client.once("ready", () => { 
console.log(`✅ Logged in as ${client.user.tag}`); 
client.user.setActivity(process.env.STATUS_MESSAGE || "🛡️ Moderating the server", { type: ActivityType.Watching }); 

// Start autoUnmute (run periodically) 
setInterval(() => autoUnmute(client), parseInt(process.env.AUTO_UNMUTE_INTERVAL) || 60000);
});

// 💬 Listen for prefix command messages
client.on("messageCreate", async (message) => { 
if (message.author.bot || !message.guild) return; 
const prefix = process.env.PREFIX || "!"; 
if (!message.content.startsWith(prefix)) return; 

const args = message.content.slice(prefix.length).trim().split(/ +/); 
const commandName = args.shift().toLowerCase(); 

const command = client.commands.get(commandName); 
if (!command) return; 

try { 
await command.execute(client, message, args); 
logToWebhook(`[COMMAND USED] ${message.author.tag} used !${commandName} in ${message.guild.name}`); 
} catch (err) { 
console.error(err); 
message.reply("⚠️ An error occurred while running this command."); 
}
});

// ⚙️ Slash command handler
const { REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// Automatically deploy slash commands
(async() => { 
const slashCommands = []; 
for (const folder of commandFolders) { 
const folderPath = path.join(__dirname, "commands", folder); 
const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith(".js")); 
for (const file of commandFiles) { 
const command = require(path.join(folderPath, file)); 
if (command.data) { 
slashCommands.push(command.data.toJSON()); 
client.slashCommands.set(command.data.name, command); 
} 
} 
} 

try { 
console.log("📡 Deploying slash commands globally..."); 
await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: slashCommands }); 
console.log("✅ Slash commands registered globally."); 
} catch (error) { 
console.error("❌ Failed to deploy slash commands:", error); 
}
})();

// 🧾 Listen for slash command interactions
client.on("interactionCreate", async (interaction) => { 
if (!interaction.isCommand()) return; 

const command = client.slashCommands.get(interaction.commandName); 
if (!command) return; 

try { 
await command.execute(interaction); 
logToWebhook(`[SLASH USED] ${interaction.user.tag} used /${interaction.commandName} in ${interaction.guild.name}`); 
} catch (error) { 
console.error(error); 
await interaction.reply({ content: "⚠️ An error occurred while running this command.", ephemeral: true }); 
}
});

// 🚀 Login bot
client.login(process.env.TOKEN);