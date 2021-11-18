const Base = require('../../structures/Slash'),
fs = require('fs');
module.exports = class AddFruit extends Base {
  constructor(client) {
    super(client, {
      name: 'add_fruit',
      description: 'Strict',
      options: [
        {
          name: 'name',
          description: 'Nome da Fruta',
          required: true,
          type: 'STRING'
        },
        {
          name: 'description',
          description: 'Descrição da Fruta',
          required: true,
          type: 'STRING'
        },
        {
          name: 'type',
          description: 'Tipo da Fruta(paramecia, logia etc)',
          required: true,
          type: 'STRING'
        },
        {
          name: 'img',
          description: 'Uma imagem da fruta',
          required: true,
          type: 'STRING'
        }
      ]
    })
  }
  async run(interaction) {
    const [name, description, type, img] = [interaction.options.getString('name'), interaction.options.getString('description'), interaction.options.getString('type'), interaction.options.getString('img')];

    let [yes, no] = [new this.client.button().setCustomId('yes').setLabel('Sim'), new this.client.button().setCustomId('no').setLabel('Não').setStyle('DANGER')];

    let row = new this.client.row().addComponents([yes, no])

    if (!interaction.member._roles?.includes('899429461395644506')) return interaction.reply({ content: 'Você não é um produtor', ephemeral: true });
    await interaction.reply({
      content: `As informações estão certas?\n\n**Nome: ${name}**\n**Descrição: ${description}**\n**Tipo: ${type}**\nImagem: ${img}`,
      ephemeral: true,
      components: [row]
    }).then(i => {
      let filter = (btn) => btn.user.id == interaction.user.id;
      interaction.channel.createMessageComponentCollector({ filter, time: 90000, max: 1 }).on('collect', async (btn) => {
        btn.deferUpdate();
        if (btn.customId === 'yes') {
          interaction.followUp({content: 'A fruta foi adicionada com sucesso!', ephemeral: true});
          fs.writeFileSync(`src/controllers/fruits/${name}.js`, `
          module.exports = {
            name: '${name} ${name} no Mi',
            aliases: ['${name}', '${name} ${name}'],
            description: '${description}',
            type: '${type}',
            img: '${img}'
          }
          `);
          message.guild.channels.cache.get('899437271336509491').send(`**Nova Fruta\n\nNome: ${name} ${name} no Mi\ndescrição: ${description}\nTipo: ${type}\nImagem: ${img}**`)
        } else if (btn.customId === 'no') {
          interaction.followUp({content:'ok',ephemeral:true});
        }
      })
    })
  }
}