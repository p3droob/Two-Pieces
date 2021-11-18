const Discord = require('discord.js');
module.exports = {
  name: "eval",
  aliases: ["e"],
  category: 'dev',
  run: async (client, message, args, prefix) => {
    let dev = `753252894974804068`;
    let dev2 = '599563864509513739';

    if (![`${dev}`].some(a => message.author.id === a)) return message.reply('Só meus criadores podem usar este comando!')
    var code = args.join(' ')
    code = code.replace(/^`{3}(js)?|`{3}$/g, '')
    code = code.replace(/<@!?(\d{16,18})>/g, 'user($1)')
    code = code.replace(process.env.TOKEN, '')
    if (!code)
      return message.reply(
        `Insira um valor para executar o eval.`
      );
      try {
        let beforeRunning = Date.now()
        let result = await eval(code);
        if (typeof result !== 'string') result = require('util').inspect(result)
        let end = (Date.now() - beforeRunning)
        result = await result.replace(/_user\((\d{16,18})\)/g, '<@$1>');
        let fileC = new Discord.MessageEmbed()
        .setTitle('Correto')
        .addField('Input:\n', '```js\n ' + code.substring(0, 1000) + '\n```')
        .setDescription('```js\n ' + result.substring(0, 4000) + '\n```')
        .setFooter(end + ' ms')
        message.reply({embeds: [fileC] }).then(msg => {
      msg.react('❌');
      const filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
const collector = message.createReactionCollector({ filter, time: 15000 });
collector.on('collect', async (reaction, user) => {
  await msg.delete()
})
    })

      } catch (e) {
        let beforeRunning2 = Date.now()
        let end2 = (Date.now() - beforeRunning2)
        let fileC = new Discord.MessageEmbed()
        .setTitle('Errado')
        .setDescription('```js\n ' + e.stack.substring(0, 4096) + '\n```')
        .setFooter(end2 + ' ms')
        message.reply({embeds: [fileC]})


      }

  }
}