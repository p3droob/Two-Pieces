const Slash = require('../../structures/Slash');

module.exports = class Update extends Slash {
  constructor(client) {
    super(client, {
      name: 'upgrades',
      description: 'Faça atualizações'
    })
  };

  async run(interaction) {
    const getUser = await this.client.db.ref(`Users/${interaction.user.id}`).once('value').then(r => r.val()) || {};

    const upgrades = new this.client.embed()
    .setTitle('Seus upgrades!')
    .setDescription(`👊 **| Força de ataque:** \`${getUser.attackForce || 1}\`\n❤️ **| Vida:** ${getUser.life}\n🍇 **| Força da fruta:** \`${getUser.fruit ? getUser.fruit.force || 1 : 'Não possui'}\`\n`);
    let atk = new this.client.button().setCustomId('attack').setLabel('Ataque'),
    life = new this.client.button().setCustomId('life').setLabel('Vida'),
    fruit = new this.client.button().setCustomId('fruit').setLabel('Fruta').setDisabled(getUser.fruit ? false : true).setStyle('DANGER')
    const components = [new this.client.row().addComponents(atk, life, fruit)];
    interaction.reply({
      embeds: [upgrades],
      components,
      fetchReply: true
    }).then(int => {
      let filter = (btn) => btn.user.id === interaction.user.id;
      int.createMessageComponentCollector({filter, time: 18000, max: 1}).on('collect', async (btn) => {
        btn.deferUpdate()
        const boolean = new this.client.row()
        .addComponents(new this.client.button().setCustomId('true').setLabel('Sim').setStyle('SUCCESS'), new this.client.button().setCustomId('false').setStyle('DANGER').setLabel('Não'));
        switch(btn.customId) {
          case 'attack':
          interaction.followUp({
            content: `Deseja mesmo aumentar sua força de ataque por ${((getUser.attackForce||1) + 1) * 7500} berries?`,
            ephemeral: true,
            components: [boolean],
            fetchReply: true,
          }).then(i => {
            i.createMessageComponentCollector({filter, time: 90000, max: 1}).on('collect', async (btn2) => {
              btn2.deferUpdate();
              if (btn2.customId === 'true') {
                if (getUser.berries < ((getUser.attackForce||1) + 1) * 7500) return interaction.followUp({
                  content: `Você não possui ${((getUser.attackForce||1) + 1) * 7500} berries! Consiga mais ${(((getUser.attackForce||1) + 1) * 7500) - getUser.berries}`
                })
                interaction.followUp({
                content: `Você aumentou sua força de ataque por ${((getUser.attackForce||1) + 1) * 7500}!`,
                ephemeral: true,
                });
                this.client.db.ref(`Users/${interaction.user.id}`).update({
                  berries: Number(getUser.berries || 0) - (((getUser.attackForce||1) + 1) * 7500),
                  attackForce: Number(getUser.attackForce || 1) + 1,
                })
              } else {
                interaction.followUp({
                  content: `Compra cancelada.`,
                  ephemeral: true,
                })
              }
            })
          })
          break;
          case 'life':
          interaction.followUp({
            content: `Você deseja mesmo aumentar a sua vida?`,
            ephemeral: true,
            fetchReply: true,
            components: [boolean]
          }).then(i => {
            i.createMessageComponentCollector({filter, max: 1}).on('collect', async btn2 => {
              if (btn2.customId === 'true') {
                interaction.followUp({
                  ephemeral: true,
                  content: `Envie o quanto de vida você deseja comprar, cada 1 custa 4750 berries.`
                })
                let message = interaction.channel.createMessageCollector({filter: msg => msg.author.id === interaction.user.id, time: 90000}).on('collect', async(msg) => {
                  if (isNaN(msg.content)) return msg.reply(`Número inválido!`);
                  if ((Number(msg.content) > 40) || (Number(msg.content) < 1) || !Number.isInteger(Number(msg.content))) return msg.reply(`Insira um número inteiro entre 1 e 40`);
                  let addLife = Number(msg.content);
                  if (Number(getUser.berries || 0) < (addLife * 4750)) return message.reply(`Você precisa de ${addLife * 4750} berries para comprar ${addLife} de vida, e você tem apenas ${getUser.berries || 0}, consiga mais ${(addLife * 4750) - (getUser.berries || 0)} berries e volte aqui.`);
                  message.stop();
                  msg.reply(`Você deseja mesmo comprar ${addLife} de vida por ${addLife * 4750} berries? Após essa compra você ficará com ${getUser.berries - (addLife * 4750)} berries.`).then(m => {
                    ['✅', '🚫'].forEach(w => m.react(w));
                    let reaction = m.createReactionCollector({filter:(r, u) => u.id === interaction.user.id,max: 1});
                    reaction.on('collect', async (r, u) => {
                      if (r.emoji.name == '🚫') return msg.reply(`Compra cancelada.`)
                      msg.reply(`Você comprou ${addLife} de vida por ${addLife * 4750} berries`);
                      this.client.db.ref(`Users/${interaction.user.id}`).update({
                        berries: Number(getUser.berries || 0) - (addLife * 4750),
                        life: Number(getUser.life || 7) + Number(addLife)
                      })
                    })
                  })
                })
              }
            })
          })
          break;
          case 'fruit':
          break;
        }
      })
    })
  }
}