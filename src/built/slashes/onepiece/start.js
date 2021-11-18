const Slash = require('../../structures/Slash');

module.exports = class Start extends Slash {
  constructor(client) {
    super(client, {
      name: 'start',
      description: 'Começar'
    })
  }
  async run(interaction, prefix='/') {
    const getAuthor = await this.client.db.ref(`Users/${interaction.user.id}`).once('value').then(r => r.val()) || {};
    if (getAuthor.started === true) return interaction.reply(this.client.lang[await interaction.user.lang](this.client, 'onepiece', 'start')(prefix).alreadyStart);
    const starting = new this.client.embed(this.client.lang[await interaction.user.lang](this.client, 'onepiece', 'start')(prefix).embeds[0]);
    await interaction.reply({
      embeds: [starting],
      components: [new this.client.row().addComponents(new this.client.button().setEmoji('<:pirate:898347112167788644>').setCustomId('pirate'))],
      fetchReply: true
      }).then(async msg => {
      let filter = (btn) => btn.user.id === interaction.user.id;
      msg.createMessageComponentCollector({filter, time: 90000}).on('collect', async (btn) => {
        btn.deferUpdate();
        const afterStarted = new this.client.embed(this.client.lang[await interaction.user.lang](this.client, 'onepiece', 'start')(prefix).embeds[1]);

        interaction.followUp({ embeds: [afterStarted] });
        this.client.db.ref(`Users/${interaction.user.id}`).update({
          level: 1,
          berries: 7e4,
          prize: 10,
          started: true,
          startedAt: Date.now(),
          class: 1
        })
      })
    });
  }
}