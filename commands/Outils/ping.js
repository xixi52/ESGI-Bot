const Command = require("../../structures/Command.js"),
  Discord = require("discord.js");

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      dirname: __dirname,
      enabled: true,
      guildOnly: false,
      desc: "Affiche la latence du Bot!",
      options: {},
      aliases: ["pong", "latency"],
      memberPermissions: [],
      botPermissions: ["SEND_MESSAGES"],
      nsfw: false,
      ownerOnly: false,
      cooldown: 1000,
    });
  }

  async run(interaction, data) {
    const client = this.client,
    date = Date.now();

    await client.api.interactions(interaction.id, interaction.token).callback.post({data: {
      type: 4,
      data: {
          content: "🏓 Pong!",
          embeds: {}
      }
    }}) 

    client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({data: {
      content: null,
      embeds: [
        {
          "author": {
            "name": "",
            "url": "",
            "icon_url": ""
          },
          "title": "🏓 Pong!",
          "url": "",
          "description": "",
          "color": data.config.embed.colorInt,
          "fields": [
            {
              "name": "💻 | Latence du serveur",
              "value": `${Math.floor(this.client.ws.ping)} ms`,
              "inline": true
            },
            {
              "name": "📟 | Latence du Bot",
              "value": `${Math.floor(Date.now() - date)} ms`
            }
          ],
          "thumbnail": {
            "url": ""
          },
          "image": {
            "url": ""
          },
          "footer": {
            "text": data.config.embed.footer,
            "icon_url": ""
          }
        }
      ]
  }})
  }
}

module.exports = Ping;
