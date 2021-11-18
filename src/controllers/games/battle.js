const Discord = require('discord.js');
module.exports = class Battle {
  constructor(client) {
    this.client = client;
  }
  async single(interaction, first,prefix='/') {
    const getUser = await this.client.db.ref(`Users/${interaction.user.id}`).once('value').then(r => r.val()) || {};//console
    getUser.life ||= 7;
    const bosses = this.client.bosses.map(boss => boss)
    .sort((a, b) => {
    if (a.prize > b.prize) return 1;
    if (a.prize < b.prize) return -1;
    return 0;
  })

    let opponent = {
      level: (getUser.level || 0) + 1,
      life: Math.ceil((getUser.level || 0) * 2.4 + 1),
      name: `Marinheir${['a', 'o'].random()} de level ${(getUser.level || 0) + 1}`
    };
    if (first === true) opponent.name = 'Oponente de treinamento';
    if (Number.isInteger(((getUser.level || 0)+1) / 40)) {
      if ((getUser.level || 0) !== 0) {
        opponent.boss = true;
        if (bosses[(((getUser.level || 0)+1) / 40)-1].fruit !== null) {
          opponent.fruit = bosses[(((getUser.level || 0)+1) / 40) - 1].fruit;
        }
          opponent.level = bosses[(((getUser.level || 0)+1) / 40) - 1].level;
          opponent.name = bosses[(((getUser.level || 0)+1) / 40) - 1].nickname || bosses[(((getUser.level || 0)+1) / 40) - 1].name;
          opponent.attacks = bosses[(((getUser.level || 0)+1) / 40) - 1].attacks;
          opponent.life = bosses[(((getUser.level || 0)+1) / 40) - 1].life;
      }
    }
    
    let start = new this.client.embed(this.client.lang[await interaction.user.lang](this.client, 'onepiece', 'batalhar')(prefix).single(opponent, getUser).embeds[0]);

    let button1 = new this.client.row().addComponents(new this.client.button({emoji: '👊', label: `Ataque`, customId: 'attack'}));
    const int = await interaction.reply({embeds: [start], components: [button1], fetchReply: true});

      let filter = (btn) => btn.user.id == interaction.user.id;
      let collector = int.createMessageComponentCollector({filter, time: 180000});

      //primeiro, reinicia
      collector.on('collect', async (btn) => {
        btn.deferUpdate();
        function nomesEmCaixa(string) {
            let strings = string.split('_');
            let result = [];
            for (let str of strings) {
            result.push(str.slice(0, 1).toUpperCase() + str.slice(1, str.length));
            }
            return result.join(' ')
          }

        let attacks = [{label: 'Soco', value: 'punch', damage: 7}, {label: 'Chute', value: 'kick', damage: 8}];
        if (getUser.attacks) {
          attacks = [];
          
          getUser.attacks.forEach(at => {
            attacks.push({label: nomesEmCaixa(at.name), value: at.name, damage: at.damage.adversary || at.damage})
          })
        };
        let action1 = new this.client.row(),
        giveup = new this.client.row().addComponents([new this.client.button().setStyle('DANGER').setCustomId('give_up').setLabel('Desistir')]),
        menu = new Discord.MessageSelectMenu({customId: 'ataques', placeholder: 'Escolha um ataque', maxValues: 1, minValues: 1});

        for (let i of attacks) {
          menu.addOptions(i)
        }
        action1.addComponents(menu);
        await interaction.followUp({ephemeral: true, components: [action1, giveup], content: 'Escolha uma ação:', fetchReply: true}).then(async i => {
          i.createMessageComponentCollector({filter, time: 60000, max: 1}).on('collect',async (btn2) => {
  let mapDamages = {
    'punch': Math.round((4.5 * 1.3 * (getUser.attackForce || 1) / 1.2) / 2  + ((4.5 * 1.3 * (getUser.attackForce || 1) / 1.2) / 2) * ((getUser.items?.sword?.damage|| 0) / 100)),
    'kick': Math.round((5 * 1.3 * (getUser.attackForce || 1) / 1.2) / 2 )
  };
            let mapDamages2 = {
              'tapa': Math.round((3.5 * 1.3 * opponent.level) / 3),
              'soco leve': Math.round((4.3 * 1.3 * opponent.level) / 3)
            }
            let ataque = {
              damage: 3
            }
            let randomAt = Object.keys(mapDamages2).random();
            if (opponent.boss) {
              randomAt = Object.keys(bosses[(((getUser.level || 0)+1) / 40) - 1].attacks).random()
              ataque = bosses[(((getUser.level || 0)+1) / 40 ) - 1].attacks[randomAt];
              mapDamages2 = {};
              mapDamages2[randomAt] = ataque.damage;
            getUser.life -= Number(ataque.damage);
            opponent.life -= !getUser.attacks ?mapDamages[btn2.values[0]] : Math.round(Number(attacks.find(a => a.value == btn2.values[0]).damage * ((getUser.attackForce || 2) / 2) + (attacks.find(a => a.value == btn2.values[0]).damage * ((getUser.attackForce || 2) / 2) * (getUser.items?.sword?.damage || 0) / 100)))
            };
            if (!opponent.boss) {
              let attacks = [];
              if (getUser.attacks)getUser.attacks.forEach(at => {
            attacks.push({label: nomesEmCaixa(at.name), value: at.name, damage: at.damage.adversary || at.damage})
             })
              getUser.life -= Number(mapDamages2[randomAt]);
              opponent.life -= !getUser.attacks ?mapDamages[btn2.values[0]] : Math.round(Number(attacks.find(a => a.value == btn2.values[0]).damage * ((getUser.attackForce || 2) / 2) + (attacks.find(a => a.value == btn2.values[0]).damage * ((getUser.attackForce || 2) / 2) * (getUser.items?.sword?.damage || 0) / 100)));
            }
            start = new this.client.embed(this.client.lang[await interaction.user.lang](this.client, 'onepiece', 'batalhar')(prefix).single(opponent, getUser).embeds[0]);
            btn2.deferUpdate();

            interaction.editReply({embeds: [start], components: [button1], fetchReply: true})

            let mapNames = {
              punch: 'soco',
              kick: 'chute'
            };
             attacks = [];
              if (getUser.attacks)getUser.attacks.forEach(at => {
            attacks.push({label: nomesEmCaixa(at.name), value: at.name, damage: at.damage.adversary || at.damage})
             })
            let ataqs = [randomAt, mapDamages2[randomAt]],
            attackss = [!getUser.attacks ?mapNames[btn2.values[0]]:attacks.find(a => a.value == btn2.values[0]).label, !getUser.attacks ?mapDamages[btn2.values[0]] : Math.round(Number(attacks.find(a => a.value == btn2.values[0]).damage * ((getUser.attackForce || 2) / 2) + (attacks.find(a => a.value == btn2.values[0]).damage * ((getUser.attackForce || 2) / 2) * (getUser.items?.sword?.damage || 0) / 100)))];
            
            interaction.followUp({
              embeds: [new this.client.embed(this.client.lang[await interaction.user.lang](this.client, 'onepiece', 'batalhar')(prefix).single(opponent, getUser, ataqs, attackss, interaction).embeds[1])]
            });
            if (getUser.life <0 && opponent.life < 0) {
              if (getUser.life < opponent.life) {
                opponent.life = 1;
                getUser.life = 0;
              } else {
                opponent.life = 0;
                getUser.life = 1
              }
            }
            if (getUser.life <= 0) {
              collector.stop();
              interaction.followUp(`Que pena ${interaction.user}, mas parece que você não é forte o suficiente para derrotar **${opponent.name}**, fique mais forte e tente novamente!`);
              this.client.db.ref(`Users/${interaction.user.id}`).update({
                battles: Number(getUser.battles || 0) + 1,
                defeateds: Number(getUser.defeateds || 0) + 1
              });
              return;
            }
            if (opponent.life <= 0) {
              getUser.life = await this.client.db.ref(`Users/${interaction.user.id}/life`).once('value').then(r => r.val());
              collector.stop();
              let berries = Math.round(Math.random() * 6000) * Math.round((opponent.level || 2) / 4);
              interaction.followUp(`Parabéns ${interaction.user}, você derrotou seu oponente e ganhou ${berries} Berries.`);
              this.client.db.ref(`Users/${interaction.user.id}`).update({
                winneds: (getUser.winneds || 0) + 1,
                battles: (getUser.battles || 0) + 1,
                life:(getUser.life || 7) + Math.floor((2 * Math.random()) +  1),
                level: (getUser.level || 0) + 1,
                berries: Number(getUser.berries || 0) + Number(berries || 105),
              });

              if (first == true){
              interaction.followUp(`Parabéns ${interaction.user}, você derrotou seu primeiro adversário!`);
              this.client.db.ref(`Users/${interaction.user.id}`).update({
                winneds: 1,
                battles: 1,
                life: 7,
                attackForce: 1,
                level: 1
              })
              }
            }
          })
        });
      })
  }
}