// CLASSES
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { token } = require("./config.json");
const fs = require("fs"),
path = require("path");
const chalk = require("chalk");
const moment = require("moment");
const timestamp = `[${moment().format("DD-MM-YYYY HH:mm:ss")}]:`;

// INSTANCE
const client = new Client({
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages
    ],
});


// COMMANDES
client.commands = new Collection();
const commandsPath = path.join(__dirname, "slash-commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// EVENTS
client.once("ready", () => {
  console.log(timestamp + " " + chalk.black.bgGreen.bold(' LOG ') + ` Le Bot est connecté en tant que ${client.user.tag}`)
});

client.once("reconnecting", () => {
  console.log(timestamp + " " + chalk.black.bgYellow.bold(' LOG ') + " Le Bot tente de se reconnecter!")
});

client.once("disconnect", () => {
  console.log(timestamp + " " + chalk.black.bgYellow.bold(' LOG ') + " Le Bot est hors ligne!")
});

// INTERACTIONS
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(timestamp + " " + chalk.black.bgWhite.bold(' LOG ') + ` L'utilisateur ${interaction.user.tag} a utilisé la commande ${interaction.name} dans #${interaction.channel.name}.`)

    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "Une erreur est survenue!", ephemeral: true });
    }
});

// LOGIN
client.login(token);