// CLASSES
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const { createConnection } = require("mysql2");
const config = require("./config.json"),
  fs = require("fs"),
  path = require("path"),
  chalk = require("chalk"),
  moment = require("moment"),
  database = createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
  }),
  timestamp = `[${moment().format("DD-MM-YYYY HH:mm:ss")}]:`;

database.connect();

// INSTANCE
const client = new Client({
  partials: [Partials.Channel, Partials.GuildMember, Partials.User],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
  ],
});

// COMMANDES
client.commands = new Collection();
const commandsPath = path.join(__dirname, "slash-commands"),
  commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file),
    command = require(filePath);
  client.commands.set(command.data.name, command);
}

// EVENTS
client.once("ready", () => {
  console.log(
    timestamp +
      " " +
      chalk.black.bgGreen.bold(" LOG ") +
      ` Le Bot est connecté en tant que ${client.user.tag}`
  );
});

client.once("reconnecting", () => {
  console.log(
    timestamp +
      " " +
      chalk.black.bgYellow.bold(" LOG ") +
      " Le Bot tente de se reconnecter!"
  );
});

client.once("disconnect", () => {
  console.log(
    timestamp +
      " " +
      chalk.black.bgYellow.bold(" LOG ") +
      " Le Bot est hors ligne!"
  );
});

// INTERACTIONS
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(
    timestamp +
      " " +
      chalk.black.bgWhite.bold(" LOG ") +
      ` L'utilisateur ${interaction.user.tag} a utilisé la commande ${interaction.commandName} dans #${interaction.channel.name}.`
  );
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Une erreur est survenue!",
      ephemeral: true,
    });
  }
});

// ROLES
client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    database.query(
      "SELECT * FROM `autorole_channel` WHERE `channel` = '" +
        interaction.channel.id +
        "'",
      async function (error, results, fields) {
        if (results) {
          if (results[0].status == 1) {
            const role = interaction.guild.roles.cache.get(
              interaction.customId
            );
            if (!role)
              return interaction.reply({
                content: "Rôle introuvable",
                ephemeral: true,
              });
            const hasRole = interaction.member.roles.cache.has(role.id);
            if (hasRole)
              return interaction.member.roles
                .remove(role)
                .then((member) => {
                  interaction.reply({
                    content: `Le role ${role} a été retiré de ton profil`,
                    ephemeral: true,
                  });
                  console.log(
                    timestamp +
                      " " +
                      chalk.black.bgGreen.bold(" ROLE ") +
                      " " +
                      member.user.username +
                      "#" +
                      member.user.discriminator +
                      " (" +
                      member.user.id +
                      ") s'est retiré le role " +
                      role.name
                  );
                })
                .catch((err) => {
                  console.log(err);
                  return interaction.reply({
                    content: "Erreur",
                    ephemeral: true,
                  });
                });
            else
              return interaction.member.roles
                .add(role)
                .then((member) => {
                  interaction.reply({
                    content: `Le role ${role} a été ajouté à ton profil`,
                    ephemeral: true,
                  });
                  console.log(
                    timestamp +
                      " " +
                      chalk.black.bgGreen.bold(" ROLE ") +
                      " " +
                      member.user.username +
                      "#" +
                      member.user.discriminator +
                      " (" +
                      member.user.id +
                      ") s'est donné le role " +
                      role.name
                  );
                })
                .catch((err) => {
                  console.log(err);
                  return interaction.reply({
                    content: "Erreur",
                    ephemeral: true,
                  });
                });
          } else {
            return interaction.reply({
              content:
                "Le message autorole est désactivé veuillez réessayer ultérieurement.",
              ephemeral: true,
            });
          }
        }
      }
    );
  }
});

// LOGIN
client.login(config.token);
