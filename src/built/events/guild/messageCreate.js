module.exports = async (client, message) => {
    const prefix = '!!';
    if ([`<@${client.user.i}>`, `<@!${client.user.id}>`].includes(message.content)) {
    const mention = new client.embed(client.lang[await message.author.lang](client, 'mention', message).embeds[0]).setImage('https://cdn.discordapp.com/attachments/852217739896815630/908818909753409586/unknown.png')
  return message.reply({embeds: [mention]});
    };
    if (message.channel.id == '899666455300288534') {
      ['✅', '❌'].forEach(e => message.react(e))
    }
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase()
    if(cmd.length === 0) return;
    let command = client.commands.get(cmd)
    if(!command) command = client.commands.get(client.aliases.get(cmd));
  try {
    //if (message.author.id !== '753252894974804068' && client.slashes.find(c => c.name === command.name)) return message.reply(`${message.author} esse comando já está disponível em slash (comandos **/**), use /${command.name} ao invés de !!${cmd}. Caso meus comandos não estejam aparecendo me readicione por este novo link: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot+applications.commands&permissions=2080374975`)
    if(command) command.run(client, message, args, prefix)
  } catch(err) {
    console.error(err)
  }
}