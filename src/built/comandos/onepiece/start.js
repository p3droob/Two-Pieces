module.exports = {
  name: 'start',
  aliases: ['iniciar', 'começar'],
  run: async (client, message, args, prefix) => {
    const getAuthor = await client.db.ref(`Users/${message.author.id}`).once('value').then(r => r.val()) || {};
    if (getAuthor.started === true) return message.reply(client.lang[await message.author.lang](client, 'onepiece', 'start')(prefix).alreadyStart);
    const starting = new client.embed(client.lang[await message.author.lang](client, 'onepiece', 'start')(prefix).embeds[0]);
    message.reply({embeds: [starting]}).then(async msg => {
      msg.react('<:pirate:898347112167788644>');
      let filter = (reaction, user) => user.id === message.author.id;
      msg.createReactionCollector({filter, time: 90000}).on('collect', async (reaction, user) => {
        if (reaction.emoji.id !== '898347112167788644') return;
        const afterStarted = new client.embed(client.lang[await message.author.lang](client, 'onepiece', 'start')(prefix).embeds[1]);

        msg.reply({ embeds: [afterStarted] });
        client.db.ref(`Users/${message.author.id}`).update({
          level: 1,
          berries: 7e4,
          prize: 10,
          started: true,
          startedAt: Date.now()
        })
      })
    })
  }
}