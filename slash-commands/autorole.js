const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { createConnection } = require("mysql2"),
  config = require("../config.json");

const database = createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

database.connect();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Activation de l'autorole")
    .addRoleOption((option) =>
      option
        .setName("salon")
        .setDescription("Salon de l'autorole")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("status")
        .setDescription("autorole on/off")
        .setRequired(true)
        .addChoices({ name: "ON", value: "on" }, { name: "OFF", value: "off" })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const getValue = interaction.options._hoistedOptions,
      channelID = getValue[0].value,
      choice = getValue[1].value,
      choiceInt = choice == "on" ? 1 : 0,
      channel = await interaction.member.guild.channels.cache.get(channelID);

    database.query(
      "SELECT * FROM `autorole_channel` WHERE `channel` = '" + channelID + "'",
      async function (error, results, fields) {
        if (results[0]) {
          if (results[0].status == "0") {
            if (choiceInt == 0) {
              await interaction.reply({
                content:
                  "Le message autorole du salon <#" +
                  channel +
                  "> est déjà désactivé",
                ephemeral: true,
              });
            } else {
              database.query(
                "UPDATE `autorole_channel` SET `status` = '" +
                  choiceInt.toString() +
                  "' WHERE `channel` = '" +
                  channelID +
                  "'",
                async function (error, results, fields) {}
              );
              await interaction.reply({
                content:
                  "Le message autorole du salon <#" +
                  channel +
                  "> a été activé",
                ephemeral: true,
              });
            }
          } else {
            if (choiceInt == 1) {
              await interaction.reply({
                content:
                  "Le message autorole du salon <#" +
                  channel +
                  "> est déjà activé",
                ephemeral: true,
              });
            } else {
              database.query(
                "UPDATE `autorole_channel` SET `status` = '" +
                  choiceInt.toString() +
                  "' WHERE `channel` = '" +
                  channelID +
                  "'",
                async function (error, results, fields) {}
              );
              await interaction.reply({
                content:
                  "Le message autorole du salon <#" +
                  channel +
                  "> a été désactivé",
                ephemeral: true,
              });
            }
          }
        } else {
          database.query(
            "INSERT INTO `autorole_channel`(`channel`, `status`) VALUES ('" +
              channelID +
              "','" +
              choiceInt.toString() +
              "')",
            async function (error, results, fields) {}
          );
          if (choiceInt == 0) {
            await interaction.reply({
              content:
                "Le message autorole du salon <#" +
                channel +
                "> a été désactivé",
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content:
                "Le message autorole du salon <#" + channel + "> a été activé",
              ephemeral: true,
            });
          }
        }
      }
    );
  },
};
