const Slash = require('../../structures/Slash');
module.exports = class Teleport extends Slash {
  constructor(client) {
    super(client, {
      name: 'teleport',
      description: 'Avance no mapa e pule para um boss',
      options: [
        {
          name: 'boss',
          type: 'NUMBER',
          description: 'número do boss de acordo com o /mapa',
          required: true
        }
      ]
    })
  }
  async run(interaction, prefix='/') {
    const client = this.client;
    const boss = interaction.options.getNumber('boss');
    const bosses = this.client.bosses.map(b => b.level);
    const getAuthor = await this.client.db.ref(`Users/${interaction.user.id}`).once('value').then(r => r.val());
    if (!getAuthor.started) return interaction.reply({content: `Você ainda não começou, use ${prefix}start`, ephemeral: true});
    if (getAuthor.cooldowns?.teleport !== undefined && 172800000 - (Date.now() - getAuthor.cooldowns?.teleport) > 0) {
      return interaction.reply({
        content: `Você já teleportou recentemente, tente novamente em ${this.client.msToTime(172800000 - (Date.now() - getAuthor.cooldowns?.teleport))}`,
        ephemeral: true,
      })
    };
    if (!Number.isInteger(boss) || bosses.includes(boss * 40)) return interaction.reply({
      content: 'Esse não é um boss válido, verifique o mapa!',
      ephemeral: true,
    });
    this.client.db.ref(`Users/${interaction.user.id}`).update({
      boss,
      cooldowns: {
        teleport: Date.now(),
      },
    });
    interaction.reply(`Você teleportou para o boss.`)
  }
}