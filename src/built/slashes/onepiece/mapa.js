const Slash = require('../../structures/Slash');
module.exports = class Ping extends Slash {
  constructor(client) {
    super(client, {
      name: 'mapa',
      description: 'Mostra o mapa'
    })
  }
  async run(interaction, prefix='/') {
    let getLevel = await this.client.db.ref(`Users/${interaction.user.id}/boss`).once('value').then(r => r.val()) || 0;
      let map = this.client.bosses.map(boss => boss);
      let mapa = map.sort((a, b) => {
      if (a.prize > b.prize) return 1;
      if (a.prize < b.prize) return -1;
      return 0;
    })
    .map((boss, i) => {
    if (i == Number(getLevel)) return `**[ ${i+1} ] ${boss.name}** - Você terá que derrotar esse boss para passar para o próximo❌`;
    if (i+1 == Number(getLevel)) return `**[ ${i+1} ] ${boss.name}** - Você está aqui❌`;
    return `**[ ${i+1} ] ${boss.name} - Level: ${(i+1)*40}**`
    });
    interaction.reply(mapa.join('\n'))
  }
}