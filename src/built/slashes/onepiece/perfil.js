const Slash = require('../../structures/Slash');
const Canvas = require('canvas'),
  construtor = require('canvas-constructor/cairo');
module.exports = class Perfil extends Slash {
  constructor(client) {
    super(client, {
      name: 'perfil',
      description: 'Mostra seu perfil',
      options: [
        {
          type: 'USER',
          name: 'user',
          description: 'usuÃ¡rio',
          required: false
        }
      ]
    })
  }
  async run(interaction, prefix = '/') {
    const user = interaction.options.getUser('user') || interaction.user;
    const getUser = await this.client.db.ref(`Users/${user.id}`).once('value').then(r => r.val()) || {};
    //console.log(getUser)
    const background = await construtor.resolveImage(getUser.wallpaper ?.attachment || 'https://cdn.discordapp.com/attachments/852217739896815630/902694160539201556/thumb-1920-958580.png');

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
    ctx.fillText(`Level: ${getUser.level || 0}`, 145, 80)
    ctx.drawImage(await Canvas.loadImage('https://cdn.discordapp.com/emojis/907046614257000489.png?size=2048'), 10, 540, 50, 50)
    ctx.fillText(getUser.life || 7, 10, 500)
    ctx.drawImage(await Canvas.loadImage('https://cdn.discordapp.com/attachments/826111853242351626/907719111935684658/unknown.png'), 80, 460, 50, 50)
    ctx.drawImage(getUser.items?.teleport !== undefined ? await Canvas.loadImage('https://cdn.discordapp.com/attachments/852217739896815630/907049841610338324/2705.png'): await Canvas.loadImage('https://cdn.discordapp.com/attachments/852217739896815630/907049807376449546/274c.png'), 80, 540, 40, 40)
    let bandeira = await Canvas.loadImage(mapFlag[getUser.lang || 'pt']);
    ctx.drawImage(bandeira, 820, 5, 150, 150)
    ctx.beginPath();
    ctx.arc(75, 75, 60, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 13, 15, 130, 130);


    back.printImage(canvas, 0, 0, 1000, 700);
    try {
    interaction.channel. send({
      files: [{ name: 'profile.png', attachment: back.toBuffer() }]
    })
        }catch (e){
      interaction. channel.send (`Ocorreu um error`)
        }
  }
}