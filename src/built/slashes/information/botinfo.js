const Slash = require('../../structures/Slash');
module.exports = class Botinfo extends Slash {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      description: 'Minhas informações',
    })
  }
  async run(interaction) {
    const users = await this.client.db.ref(`Users`).once('value').then(r => r.val());
    const guild = this.client.guilds.cache.get('852217739896815626');
    const botinfo = new this.client.embed()
    .setTitle('Minhas informações')
    .addFields([
      {
        name: 'Usuários',
        value: `${this.client.users.cache.size}`
      },
      {
        name: 'Servidores',
        value: `${this.client.guilds.cache.size}`
      },
      {
        name: 'Usuários que já começaram',
        value: `${Object.keys(users).filter(u => users[u].started == true).length} pessoas`
      },
      {
        name: '<:hie_hie_no_mi:908412982818648065> Frutas que podem ser compradas',
        value: `${this.client.fruits.filter(f => guild.emojis.cache.find(e => e.name == f.name.split(' ').join('_').toLowerCase())).size}`
      }
      ])
      interaction.reply({embeds: [botinfo]})
  }
}