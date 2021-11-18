module.exports = {
  name: 'loja',
  aliases: ['shop'],
  run: async(client, message, args) => {
    const getLoja = await client.db.ref(`Shop`).once('value').then(r => r.val()) || [];
    
      let btn1 = new client.button().setLabel('Frutas').setEmoji('🍇').setCustomId('fruit')
      btn2 = new client.button().setLabel('Espadas').setEmoji('⚔️').setCustomId('sword')
      let row = new client.row().addComponents(btn1, btn2)
    const choose = new client.embed({title: 'Lojas'})

    message.reply({embeds: [choose], components: [row]}).then(msg => {
      let filter = (btn) => btn.user.id === message.author.id;
      let collector = msg.createMessageComponentCollector({filter, time: 9000, max: 1});
      collector.on('collect', async (btn) => {
        btn.deferUpdate();
        switch(btn.customId) {
          case 'sword':
          const maxPerPage = 10;
          let queue = getLoja.swords || [];
          const pages = Math.ceil(queue.length / maxPerPage);
          let page = 0;
          choose.setTitle('Espadas').setFooter(`Página ${page+1}/${pages}`).setDescription(queue.slice(page * maxPerPage, (page * maxPerPage) + maxPerPage).map((d, i) => `**[${i+1}]** - ${d.name} - ${client.customEmojis.beri}${d.value}`).join('\n'));
          msg.edit({embeds: [choose], components: []});
          break;
          case 'fruit':
          const maxPerPage2 = 10;
          let queue2 = getLoja.fruits || [];
          const pages2 = Math.ceil(queue2.length / maxPerPage2);
          let page2 = 0;
          choose.setTitle('Espadas').setFooter(`Página ${page2+1}/${pages2}`).setDescription(queue2.slice(page2 * maxPerPage2, (page2 * maxPerPage2) + maxPerPage2).map((d, i) => `**[${i+1}]** - ${d.emoji}${d.name} - ${client.customEmojis.beri}${d.value}`).join('\n'));
          let arrow3 = new client.button().setCustomId('fruit_back').setEmoji('⬅️'),
          arrow4 = new client.button().setCustomId('fruit_go').setEmoji('➡️');
          let rowFruit = new client.row().addComponents(arrow3, arrow4);
          msg.edit({embeds: [choose], components: [rowFruit]}).then(msg2 => {
            msg2.createMessageComponentCollector({filter}).on('collect', comp => {
              comp.deferUpdate()
              switch(comp.customId) {
                case 'fruit_back':
                if (page2 === 0) page2 = pages2;
                page2--;
                choose.setTitle('Espadas').setFooter(`Página ${page2+1}/${pages2}`).setDescription(queue2.slice(page2 * maxPerPage2, (page2 * maxPerPage2) + maxPerPage2).map((d, i) => `**[${i+1}]** - ${d.emoji}${d.name} - ${client.customEmojis.beri}${d.value}`).join('\n'));
                msg2.edit({embeds: [choose]});
                break;
                case 'fruit_go':
                if (page2 === Number(pages2 - 1)) page2 = -1;
                page2++;
                choose.setTitle('Espadas').setFooter(`Página ${page2+1}/${pages2}`).setDescription(queue2.slice(page2 * maxPerPage2, (page2 * maxPerPage2) + maxPerPage2).map((d, i) => `**[${i+1}]** - ${d.emoji}${d.name} - ${client.customEmojis.beri}${d.value}`).join('\n'));
                msg2.edit({embeds: [choose]});
                break;
              }
            })
          })
          break;
        }
      })
    })
  }
}