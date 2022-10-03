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
    .setName("role")
    .setDescription("Gestion de l'autorole")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Role à ajouter ou supprimer")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("Salon de l'autorole")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const roleID = interaction.options._hoistedOptions[0].value,
      channelID = interaction.options._hoistedOptions[1].value;

    database.query(
      "SELECT * FROM `autorole_channel` WHERE `channel` = '" + channelID + "'",
      async function (error, results, fields) {
        let messageRole = null;
        if (results[0]) messageRole = results[0].message_id;

        database.query(
          "SELECT * FROM `autorole_role` WHERE `channel_id` = '" +
            channelID +
            "'",
          async function (error, results, fields) {
            const lenghtDB = results.length;

            database.query(
              "SELECT * FROM `autorole_role` WHERE `role_id` = '" +
                roleID +
                "' AND `channel_id` = '" +
                channelID +
                "'",
              async function (error, results, fields) {
                if (error) throw error;

                const channel =
                    await interaction.member.guild.channels.cache.get(
                      channelID
                    ),
                  role = await interaction.member.guild.roles.cache.get(roleID);
                if (results[0]) {
                  database.query(
                    "DELETE FROM `autorole_role` WHERE `role_id` = '" +
                      roleID +
                      "' AND `channel_id` = '" +
                      channelID +
                      "'",
                    async function (error, results, fields) {
                      if (error) throw error;

                      if (lenghtDB == 1) {
                        try {
                          await interaction.member.guild.channels.cache
                            .get(channelID)
                            .messages.fetch(messageRole)
                            .then((message) => {
                              message.delete();
                            });
                        } catch (error) {}
                        await interaction.reply({
                          content:
                            "Le rôle <@&" +
                            role +
                            "> a été supprimé du message autorole, il n'y a maintenant plus de bouton! Le message du salon <#" +
                            channel +
                            "> a donc été supprimé. Vous pouvez le réactiver en ajoutant un role en retapant cette commande!",
                          ephemeral: true,
                        });
                      } else {
                        database.query(
                          "SELECT * FROM `autorole_channel` WHERE `channel` = '" +
                            channelID +
                            "'",
                          async function (error, results, fields) {
                            if (error) throw error;

                            if (results[0]) {
                              if (results[0].status == 0) {
                                database.query(
                                  "SELECT * FROM `autorole_role` WHERE `channel_id` = '" +
                                    channelID +
                                    "'",
                                  async function (error, results, fields) {
                                    const comp = new ActionRowBuilder();

                                    await results.forEach(async (role) => {
                                      const roleName =
                                        await interaction.member.guild.roles.cache.get(
                                          role.role_id
                                        ).name;

                                      comp.addComponents(
                                        new ButtonBuilder()
                                          .setCustomId(role.role_id)
                                          .setLabel(roleName)
                                          .setStyle(1)
                                      );
                                    });

                                    await interaction.member.guild.channels.cache
                                      .get(channelID)
                                      .send({
                                        content: "Selection de role",
                                        components: [comp],
                                      })
                                      .then((message) => {
                                        database.query(
                                          "UPDATE `autorole_channel` SET `message_id` = '" +
                                            message.id +
                                            "' WHERE `channel` = '" +
                                            channelID +
                                            "'",
                                          async function (
                                            error,
                                            results,
                                            fields
                                          ) {}
                                        );
                                      });
                                await interaction.reply({
                                  content:
                                    "Le rôle <@&" +
                                    role +
                                    "> a été supprimé du message autorole, cependant le message n'est pas actif (utilisez la commande /autorole salon:<#" +
                                    channel +
                                    "> status:ON)",
                                  ephemeral: true,
                                });
                              });
                              } else {
                                try {
                                  await interaction.member.guild.channels.cache
                                    .get(channelID)
                                    .messages.fetch(results[0].message_id)
                                    .then((message) => {
                                      message.delete();
                                    });
                                } catch (error) {}

                                database.query(
                                  "SELECT * FROM `autorole_role` WHERE `channel_id` = '" +
                                    channelID +
                                    "'",
                                  async function (error, results, fields) {
                                    const comp = new ActionRowBuilder();

                                    await results.forEach(async (role) => {
                                      const roleName =
                                        await interaction.member.guild.roles.cache.get(
                                          role.role_id
                                        ).name;

                                      comp.addComponents(
                                        new ButtonBuilder()
                                          .setCustomId(role.role_id)
                                          .setLabel(roleName)
                                          .setStyle(1)
                                      );
                                    });

                                    await interaction.member.guild.channels.cache
                                      .get(channelID)
                                      .send({
                                        content: "Selection de role",
                                        components: [comp],
                                      })
                                      .then((message) => {
                                        database.query(
                                          "UPDATE `autorole_channel` SET `message_id` = '" +
                                            message.id +
                                            "' WHERE `channel` = '" +
                                            channelID +
                                            "'",
                                          async function (
                                            error,
                                            results,
                                            fields
                                          ) {}
                                        );
                                      });

                                    await interaction.reply({
                                      content:
                                        "Le rôle <@&" +
                                        role +
                                        "> a été supprimé du message autorole, le message dans le salon <#" +
                                        channel +
                                        "> a été mis à jour",
                                      ephemeral: true,
                                    });
                                  }
                                );
                              }
                            } else {
                              await interaction.reply({
                                content:
                                  "Le rôle <@&" +
                                  role +
                                  "> a été supprimé du message autorole, cependant il n'y a pas de salon configuré (utilisez la commande /autorole salon:<#" +
                                  channel +
                                  "> status:ON)",
                                ephemeral: true,
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                } else {
                  if (lenghtDB >= 5) {
                    await interaction.reply({
                      content:
                        "le message autorole ne peut pas contenir plus de 5 boutons!",
                      ephemeral: true,
                    });
                  } else {
                    database.query(
                      "INSERT INTO `autorole_role`(`role_id`, `channel_id`) VALUES ('" +
                        roleID +
                        "','" +
                        channelID +
                        "')",
                      async function (error, results, fields) {
                        if (error) throw error;
                        database.query(
                          "SELECT * FROM `autorole_channel` WHERE `channel` = '" +
                            channelID +
                            "'",
                          async function (error, results, fields) {
                            if (error) throw error;

                            if (results[0]) {
                              if (results[0].status == 0) {
                                database.query(
                                  "SELECT * FROM `autorole_role` WHERE `channel_id` = '" +
                                    channelID +
                                    "'",
                                  async function (error, results, fields) {
                                    const comp = new ActionRowBuilder();

                                    await results.forEach(async (role) => {
                                      const roleName =
                                        await interaction.member.guild.roles.cache.get(
                                          role.role_id
                                        ).name;

                                      comp.addComponents(
                                        new ButtonBuilder()
                                          .setCustomId(role.role_id)
                                          .setLabel(roleName)
                                          .setStyle(1)
                                      );
                                    });

                                    await interaction.member.guild.channels.cache
                                      .get(channelID)
                                      .send({
                                        content: "Selection de role",
                                        components: [comp],
                                      })
                                      .then((message) => {
                                        database.query(
                                          "UPDATE `autorole_channel` SET `message_id` = '" +
                                            message.id +
                                            "' WHERE `channel` = '" +
                                            channelID +
                                            "'",
                                          async function (
                                            error,
                                            results,
                                            fields
                                          ) {}
                                        );
                                      });
                                await interaction.reply({
                                  content:
                                    "Le rôle <@&" +
                                    role +
                                    "> a été ajouté au message autorole, cependant le message n'est pas actif (utilisez la commande /autorole salon:<#" +
                                    channel +
                                    "> status:ON)",
                                  ephemeral: true,
                                });
                              });
                              } else {
                                try {
                                  await interaction.member.guild.channels.cache
                                    .get(channelID)
                                    .messages.fetch(results[0].message_id)
                                    .then((message) => {
                                      message.delete();
                                    });
                                } catch (error) {}

                                database.query(
                                  "SELECT * FROM `autorole_role` WHERE `channel_id` = '" +
                                    channelID +
                                    "'",
                                  async function (error, results, fields) {
                                    const comp = new ActionRowBuilder();

                                    await results.forEach(async (role) => {
                                      const roleName =
                                        await interaction.member.guild.roles.cache.get(
                                          role.role_id
                                        ).name;

                                      comp.addComponents(
                                        new ButtonBuilder()
                                          .setCustomId(role.role_id)
                                          .setLabel(roleName)
                                          .setStyle(1)
                                      );
                                    });

                                    await interaction.member.guild.channels.cache
                                      .get(channelID)
                                      .send({
                                        content: "Selection de role",
                                        components: [comp],
                                      })
                                      .then((message) => {
                                        database.query(
                                          "UPDATE `autorole_channel` SET `message_id` = '" +
                                            message.id +
                                            "' WHERE `channel` = '" +
                                            channelID +
                                            "'",
                                          async function (
                                            error,
                                            results,
                                            fields
                                          ) {}
                                        );
                                      });

                                    await interaction.reply({
                                      content:
                                        "Le rôle <@&" +
                                        role +
                                        "> a été ajouté au message autorole, le message dans le salon <#" +
                                        channel +
                                        "> a été mis à jour",
                                      ephemeral: true,
                                    });
                                  }
                                );
                              }
                            } else {
                              await interaction.reply({
                                content:
                                  "Le rôle <@&" +
                                  role +
                                  "> a été ajouté au message autorole, cependant il n'y a pas de salon configuré (utilisez la commande /autorole salon:<#" +
                                  channel +
                                  "> status:ON)",
                                ephemeral: true,
                              });
                            }
                          }
                        );
                      }
                    );
                  }
                }
              }
            );
          }
        );
      }
    );
  },
};
