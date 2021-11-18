const Slash = require('../../structures/Slash');
module.exports = class Batalhar extends Slash {
  constructor(client) {
    super(client, {
      name: 'batalhar',
      description: 'Battle with npc or user',
      options: [
            {
              type: 'SUB_COMMAND',
              name: 'player',
              description: 'usuário',
              options: [
                {
                  type: 'USER',
                  name: 'user',
                  required: true,
                  description: '@user/ id'
                }
              ]
            },
            {
              type: 'SUB_COMMAND',
              name: 'npc',
              description: 'batalhe com um npc',
              options: []
            },
            {
              type: 'SUB_COMMAND',
              name: 'stats',
              description: 'Mostra o status de batalhas',
              options: [
                {
                  type: 'USER',
                  name: 'status',
                  required: false,
                  description: '@user/ id',
                }
              ]
            }
      ]
    })
  }
  async run(interaction, prefix='/') {
    const comando = interaction.options._subcommand;
    const getAuthor = await this.client.db.ref(`Users/${interaction.user.id}`).once('value').then(r => r.val()) || {};
    
    if (getAuthor.started !== true) return interaction.reply(this.client.lang[await interaction.user.lang](this.client, 'onepiece', 'batalhar')(prefix).not);

    if (!getAuthor.battles) {
      return await (new this.client.games.battle(this.client).single(interaction, true));
    
    }
    if (comando == 'npc') {
      if (!getAuthor.battles) return;
      new this.client.games.battle(this.client).single(interaction);
    };
    if (comando == 'stats') {
      let user = interaction.options.getUser('status') || interaction.user;
      let getUser = await this.client.db.ref(`Users/${user.id}`).once('value').then(r => r.val()) || {};
      if (!getUser.battles) return interaction.reply(`${user.username} não possui Estatísticas de Batalha`)
      interaction.reply(`**Estatísticas de Batalha de ${user.username}**\n\n<:participated:907583761678467073> **| Batalhas participadas (100%):** ${getUser.battles || 0}\n<:winner:907579940457820161> **| Vencidas (${(((getUser.winneds || 0) / (getUser.battles || 0)) * 100).toFixed(2)}%):** ${getUser.winneds || 0}\n<:loser:907582354896326656> **| Perdidas (${(((getUser.defeateds || 0) / (getUser.battles || 0)) * 100).toFixed(2)}%): **${getUser.defeateds || 0}`)
    }
  }
}