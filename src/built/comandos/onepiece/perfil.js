const Canvas = require('canvas'),
construtor = require('canvas-constructor/cairo');
module.exports = {
  name: 'perfil',
  aliases: ['p', 'profile'],
  run: async (client, message, args, prefix) => {
    const user = message.mentions.users.first() || message.author;
    const getUser = await client.db.ref(`Users/${user.id}`).once('value').then(r => r.val());
    if (!getUser) {
      client.db.ref(`Users/${user.id}`).update({
        wallpaper: 'https://cdn.discordapp.com/attachments/852217739896815630/902694160539201556/thumb-1920-958580.png'
      })
    return message.reply(`Já que você não está no meu banco de dados, use o comando novamente!`)
    };
    const background = await construtor.resolveImage(getUser.wallpaper?.attachment || 'https://cdn.discordapp.com/attachments/852217739896815630/902694160539201556/thumb-1920-958580.png');

    const back = new (construtor).Canvas(1000, 700)
  	.setColor('#000000')
    .printImage(background, 0, 0, 1000, 700)
    .setColor('#15c2dd')
    .printRectangle(0, 0, 1000, 150)//cima
    .printRectangle(0, 450, 1000, 250)//baixo
    .setColor('#ff0000')

    const { registerFont } = require('canvas')
    registerFont('./helsinki.ttf', { family: 'helsinki' })
    const canvas = Canvas.createCanvas(1000, 700);
    const ctx = canvas.getContext('2d');
    const path = await Canvas.loadImage(back.toBuffer())

    let mapFlag = {
      pt: 'https://cdn.discordapp.com/attachments/852217739896815630/902875833880952892/407b23225039d193f5e539e2de0900f2.png',
      en: 'https://cdn.discordapp.com/attachments/852217739896815630/902875855238357022/d788b9231ed2028dc29245f76cf0a415.png',
    };

    ctx.drawImage(path, 0, 0, canvas.width, canvas.height)
    ctx.font = '30px helsinki';
    ctx.fillText(user.username.slice(0, 20), 135, 40);
    ctx.fillText(`Berries: ${getUser.berries || 0}`, 10, 650);
    let bandeira = await Canvas.loadImage(mapFlag[getUser.lang || 'pt']);
    ctx.drawImage(bandeira, 820, 5, 150, 150)
    ctx.beginPath();
    ctx.arc(75, 75, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 13, 15, 130, 130);


    back.printImage(canvas, 0, 0, 1000, 700);
    message.reply({
      files: [{ name: 'profile.png', attachment: back.toBuffer() }]
    })
  }
}