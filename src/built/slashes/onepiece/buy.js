const Slash = require('../../structures/Slash');
module.exports = class Buy extends Slash {
  constructor(client) {
    super(client, {
      name: 'buy',
      description: 'Compre um item/fruta/espada',
      options: [
        {
          name: 'fruta',
          type: 3,
          description: 'Nome da fruta',
          required: false,
          choices: [
            {
              name: 'Random',
              value: 'random'
            }
          ],
          min_value: 1,
          max_value: 1,
        },
        {
          name: 'espada',
          type: 3,
          description: 'nome da espada',
          required: false,
          choices: [],
          min_value: 1,
          max_value: 1
        },
        {
          name: 'item',
          type: 3,
          description: 'nome do item',
          required: false,
          choices: [],
          min_value: 1,
          max_value: 1
        }
      ]
    });
  }
  async run(interaction) {
    const getAuthor = await this.client.db.ref(`Users/${interaction.user.id}`).once('value').then(r => r.val()) || 0;
    if (!getAuthor.started) return interaction.reply({
      content: 'Você ainda não começou, use /start',
      ephemeral: true
    })
    const {espada, fruta, item} = {
      espada: interaction.options.getString('espada'),
      fruta: interaction.options.getString('fruta'),
      item: interaction.options.getString('item')
    };
    if ([espada, fruta, item].filter(a => a !== null).length > 1) return interaction.reply({content:`Você só pode comprar um item por vez!`, ephemeral: true});
    if (espada) {
      //caso queira comprar uma espada

      let sword = await this.client.db.ref(`Shop/swords`).once('value').then(r => r.val().find(s => s.name === interaction.options._hoistedOptions[0].value));

      if (!sword) return interaction.reply({content:`Espada não encontrada`, ephemeral: true});
      if ((getAuthor.berries || 0) < sword.value) return interaction.reply({
        content: 'Você não possui berries o suficiente para comprar esta espada ' + `(${sword.value})`,
        ephemeral: true,
      });
      this.client.db.ref(`Users/${interaction.user.id}/berries`).set(Number(getAuthor.berries) - Number(sword.value));
      this.client.db.ref(`Users/${interaction.user.id}/items/sword`).set({
        name: sword.name,
        value: sword.value,
        damage: sword.damage
      });
      return interaction.reply(`Você comprou um ${sword.name} por ${sword.value} Berries com sucesso! Ela aumenta os seus ataques em ${sword.damage}%`)
    };
    if (fruta) {
      let fruit = await this.client.db.ref(`Shop/fruits`).once('value').then(r => r.val().find(f => f.aliases.includes(interaction.options._hoistedOptions[0].value)));
      if (interaction.options._hoistedOptions[0].value.toLowerCase() == 'random ') return;
      if (!fruit) return interaction.reply({
        content: 'Fruta não encontrada!',
        ephemeral: true
      })
      if (getAuthor.berries < fruit.value) return interaction.reply({
        content: `Você precisa de ${fruit.value} berries para comprar a ${fruit.name}!`,
        ephemeral: true,
      });
      this.client.db.ref(`Users/${interaction.user.id}/berries`).set(Number(getAuthor.berries || 0) - Number(fruit.value));
      let attacks = [];
      Object.keys(fruit.attacks).forEach(atk => {
        let atk2 = fruit.attacks[atk];
        attacks.push({
          damage: atk2.damage.adversary || atk2.damage,
          name: atk
        })
      })
      this.client.db.ref(`Users/${interaction.user.id}/attacks`).set(attacks);

      this.client.db.ref(`Users/${interaction.user.id}/fruit`).set(fruit);
      interaction.reply(`Você comprou ${fruit.name} por ${fruit.value} e ela vem com ${attacks.length} ataques.`)
    };
    if (item) {
      //caso queira comprar um item
    }
  };

  async loadOptions(options) {
    const loja = await this.client.db.ref(`Shop`).once('value').then(r => r.val());
    loja.swords?.forEach(sword => {
      options.swords.push({
        name: `${sword.name} - ${sword.value}`,
        value: sword.name
      });
    });
    let queue2 = loja.fruits || [];
    let trustQueue = [];
    queue2.forEach(q => {
      if (trustQueue.map(a => a.name).includes(q.name))return;
      trustQueue.push(q)
    });
    trustQueue = trustQueue.sort((a, b) => {
      if (a.value < b.value) return 1;
      if (a.value > b.value) return -1;
      return 0;
    })
    trustQueue?.forEach(fruit => {
      options.fruits.push({
        name: `${fruit.name} - ${fruit.value}`,
        value: fruit.name.split(' ')[0],
      })
    });
    loja.items?.forEach(i => {
      options.items.push({
        name: `${i.name} - ${i.value}`,
        value: i.code
      })
    });

    return this.options[0].choices;
  }
}