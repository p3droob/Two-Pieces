const Command = require('../../structures/Slash');
module.exports = class Eval extends Command {
  constructor(client) {
        super(client, {
            name: 'eval',
            description: 'Strict',
            options: [
              {
                name: 'code',
                type: 'STRING',
                required: true,
                description: 'Código'
              }
            ]
        })
    }
  async run(interaction, prefix='/') {
    const args = interaction.options.getString('code').split(/ +/g)//inspect
    interaction.author = interaction.user;
    let dev = `753252894974804068`;
    let dev2 = '599563864509513739';

    if (![`${dev}`].some(a => interaction.author.id === a)) return interaction.reply({ content: 'Só **Shichibukais** tem permissão para usar este comando!', ephemeral: true })
    var code = args.join(' ')
    code = code.replace(/^`{3}(js)?|`{3}$/g, '')
    code = code.replace(/<@!?(\d{16,18})>/g, 'user($1)')
    code = code.replace(process.env.TOKEN, '')
    if (!code)
      return interaction.reply(
        `Insira um valor para executar o eval.`
      );
      try {
        let beforeRunning = Date.now()
        let result = await eval(code);
        let resultado = require('util').inspect(result);
        let end = (Date.now() - beforeRunning)

        let fileC = `✅!\n\nInput:\n\`\`\`js\n${code.substring(0, 500)}\n\`\`\`\nSaiu\`\`\`js\n${resultado.slice(0, 1400)}\n\`\`\`\n\n${end} ms\n\nTipo: ${typeof result}`
        interaction.reply({ephemeral: true, content: fileC.slice(0, 4000) });

      } catch (e) {
        let beforeRunning2 = Date.now()
        let end2 = (Date.now() - beforeRunning2)
        let fileC = new this.client.embed()
        .setTitle('Errado')
        .setDescription('```js\n ' + e.stack.substring(0, 1000) + '\n```')
        .setFooter(end2 + ' ms')
        interaction.reply({ephemeral: true, embeds: [fileC]})


      }
  }
}