const Slash = require('../../structures/Slash');
module.exports = class Ping extends Slash {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Pong',
    })
  }
  async run(interaction) {
    const client = this.client;
    const response = new client.embed()
.setDescription(client.lang[await interaction.user.lang](client, 'information', 'ping').embeds[0].description)
    await interaction.reply({embeds: [response] });
  }
}