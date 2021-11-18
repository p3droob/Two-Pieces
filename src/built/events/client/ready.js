function getRandom(array) {
  const auxArray = Array.from(array)
  auxArray.reduce((acc, curr, i, a) => a[i] = acc + curr.chance, 0)

  return array[auxArray.findIndex(w => w > Math.random()*auxArray[auxArray.length-1])]
}
module.exports = async (client) => {
  const users = await client.db.ref(`Users`).once('value').then(r => r.val());
  let activities = [
    `${client.bosses.size} Chefões para serem derrotados!`,
    `${Object.keys(users).filter(u => users[u].started == true).length} pessoas que já começaram sua jornada! Começe você também, use /start`
  ],
  i=0;

  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "PLAYING"
      }), 1000 * 60 * 5); 

  console.log(`[ CLIENT ] - ${client.user.tag} Online!`);


  client.application.commands.set(client.slashes.map(cmd => cmd));

  //const evalCmd = client.application.commands.fetch().then(cmds => cmds.find(c => c.name == 'eval'));

  client.application.commands.edit('899312684066045962', {
    permissions: [
  {
    id: '753252894974804068',
    type: 'USER',
    permission: false
  },
]})


  const last = await client.db.ref(`lastFruit`).once('value').then(r => r.val()) || 0;
  const fruits = await client.db.ref(`Shop/fruits`).once('value').then(r => r.val()) || [];

  async function createFruits() {
    const guild = client.guilds.cache.get('852217739896815626');

    const avaliableFruits = client.fruits.filter(f => guild.emojis.cache.find(e => e.name == f.name.split(' ').join('_').toLowerCase()));

    let newFruits = [];
    for (let i=0; i < 4; i++) {
      let randomFruit = avaliableFruits.random();
      if (newFruits.includes(randomFruit)) break;
      newFruits.push(randomFruit)
      fruits.push(randomFruit)
    };
    console.log(`Foram adicionadas as frutas ${newFruits.map(f => f.name.split(' ')[0]).join('\n')}`);
    const updates = client.channels.cache.get('907379052694896681');
    updates.send({
      embeds: [
        new client.embed().setTitle('Novas frutas')
        .setDescription(newFruits.map((f, i) => `**[${i+1}] - ${f.name} - ${f.emoji}**`).join('\n'))
      ],
      content: `<@&899418815459389440>`
    });
    client.db.ref(`Shop/fruits`).set(fruits);
    client.db.ref(`lastFruit`).set(Date.now());
    await require('../../handlers/slash')(client)
};

  if ((Number(last) + 86400000) >= Date.now()) console.log(`Nenhuma fruta adicionada, próxima em: ${client.msToTime(last + 86400000 - Date.now())}`);

  if ((Number(last) + 86400000) >= Date.now()) return setTimeout(async () => {
    await createFruits()
    setInterval(async () => {
      await createFruits()
    }, 86400000)
  }, last + 86400000 - Date.now());

  await createFruits()
}