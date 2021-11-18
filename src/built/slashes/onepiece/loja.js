const Slash = require('../../structures/Slash');
module.exports = class Ping extends Slash {
  constructor(client) {
    super(client, {
      name: 'loja',
      description: 'Loja'
    })
  }
  async run(interaction, prefix='/') {
    const getLoja = await this.client.db.ref(`Shop`).once('value').then(r => r.val()) || {};
    const getAuthor = await this.client.db.ref(`Users/${interaction.user.id}`).once('value').then(r => r.val());
    getAuthor.items ??= {};
    
      let btn1 = new this.client.button().setLabel('Frutas').setEmoji('🍇').setCustomId('fruit'),
      btn2 = new this.client.button().setLabel('Espadas').setEmoji('⚔️').setCustomId('sword'),
      btn3 = new this.client.button().setLabel('Itens').setEmoji('<:bag:907015715238866975>').setCustomId('itens')
      
      let row = new this.client.row().addComponents(btn1, btn2, btn3)
    const choose = new this.client.embed({title: 'Lojas'})

    interaction.reply({
      embeds: [choose],
      components: [row],
      fetchReply: true
      }).then(msg => {
      let filter = (btn) => btn.user.id === interaction.user.id;
      let collector = msg.createMessageComponentCollector({filter, time: 90000, max: 1});
      collector.on('collect', async (btn) => {
        btn.deferUpdate();
        switch(btn.customId) {
          case 'sword':
          const maxPerPage = 10;
          let queue = getLoja.swords || [];
          const pages = Math.ceil(queue.length / maxPerPage);
          let page = 0;
          choose.setTitle('Espadas').setDescription(queue.slice(page * maxPerPage, (page * maxPerPage) + maxPerPage).map((d, i) => `**[${i+1}]** - ${d.name} - ${this.client.customEmojis.beri}${d.value} - 👊${d.damage}`).join('\n'));
          msg.edit({embeds: [choose], components: []});
          break;
          case 'fruit':
          const maxPerPage2 = 10;
          let queue2 = getLoja.fruits || [];
          let trustQueue = [];
          queue2.forEach(q => {
            if (trustQueue.map(a => a.name).includes(q.name)) return;
            trustQueue.push(q)
          });
          queue2 = trustQueue.sort((a, b) => {
            if (a.value < b.value) return 1;
            if (a.value > b.value) return -1;
            return 0;
          })
          const pages2 = Math.ceil(queue2.length / maxPerPage2);
          let page2 = 0;
          choose.setTitle('Frutas disponíveis').setFooter(`Página ${page2+1}/${pages2}`).setDescription(queue2.slice(page2 * maxPerPage2, (page2 * maxPerPage2) + maxPerPage2).map((d, i) => `**[${(getLoja.fruits || []).filter(f =>  f.name === d.name).length}]** - ${d.emoji}${d.name} - ${this.client.customEmojis.beri}${d.value}`).join('\n'));
          let arrow3 = new this.client.button().setCustomId('fruit_back').setEmoji('⬅️'),
          arrow4 = new this.client.button().setCustomId('fruit_go').setEmoji('➡️');
          let rowFruit = new this.client.row().addComponents(arrow3, arrow4);
          msg.edit({embeds: [choose], components: [rowFruit]}).then(msg2 => {
            msg2.createMessageComponentCollector({filter}).on('collect', comp => {
              comp.deferUpdate()
              switch(comp.customId) {
                case 'fruit_back':
                if (page2 === 0) page2 = pages2;
                page2--;
                choose.setTitle('Frutas disponiveis').setFooter(`Página ${page2+1}/${pages2}`).setDescription(queue2.slice(page2 * maxPerPage2, (page2 * maxPerPage2) + maxPerPage2).map((d, i) => `**[${(getLoja.fruits || []).filter(f =>  f.name === d.name).length}]** - ${d.emoji}${d.name} - ${this.client.customEmojis.beri}${d.value}`).join('\n'));
                interaction.editReply({embeds: [choose]});
                break;
                case 'fruit_go':
                if (page2 === Number(pages2 - 1)) page2 = -1;
                page2++;
                choose.setTitle('Frutas disponíveis').setFooter(`Página ${page2+1}/${pages2}`).setDescription(queue2.slice(page2 * maxPerPage2, (page2 * maxPerPage2) + maxPerPage2).map((d, i) => `**[${(getLoja.fruits || []).filter(f =>  f.name === d.name).length}]** - ${d.emoji}${d.name} - ${this.client.customEmojis.beri}${d.value}`).join('\n'));
                interaction.editReply({embeds: [choose]});
                break;
              }
            })
          })
          break;

          case 'itens':
          const items = getLoja.items || [];
          const allItems = new this.client.embed()
          .setTitle('Itens disponíveis para compra')
          .setDescription(items.map(i => `${i.name} - ${this.client.customEmojis.beri}${i.value} - ${getAuthor.items[i.name] !== undefined ? `✅`:'❌'}`).join('\n'))
          msg.edit({embeds: [allItems]})
          break;
        }
      })
    })
  }
}