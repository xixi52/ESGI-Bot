const Discord = require("discord.js"),
express = require('express'),
app = express(),
path = require('path');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {

    const client = this.client,
    data = {};

    data.config = client.config;

    // Logs some informations using the logger file
    client.logger.log(
      `Loading a total of ${client.commands.size} command(s).`,
      "log"
    );

    client.logger.log(
      `${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`,
      "ready"
    );

    // Update the game every 20s
    client.user.setActivity("Visual Studio Code");

    client.ws.on('INTERACTION_CREATE', async interaction => {
      const command = interaction.data.name.toLowerCase();
      const cmd = await this.client.commands.get(command);
      client.logger.log(
          `${interaction.member.user.username} (${interaction.member.user.id}) ran command ${cmd.help.name}`,
          "cmd"
        );
  
        try {
          cmd.run(interaction, data);
        } catch (e) {
          console.error(e);
        }
    })

  }
};
