module.exports = {
  name: 'ping',
  aliases: ['pong'],
  run: async (client, message, args, prefix) => {
    const showPing = new client.embed()
    .setTitle('Pong')
    .setDescription(client.lang[await message.author.lang](client, 'information', 'ping').embeds[0].description);
    message.channel.send({embeds: [showPing]});
  }
}