const Discord = require('discord.js');
module.exports = {
  name: 'background',
  aliases: ['setback', 'back'],
  run: async (client, message, args, prefix) => {
    let attachment = message.attachments.first();
    if (!attachment) return message.reply('Anexe um arquivo de um background para o seu perfil!');
    
    if (((attachment.width * 0.7) - attachment.height) > 200 || ((attachment.width * 0.7) - attachment.height) < -50) return message.reply(`A imagem deve ser proporcional a 1000x700. A altura deve ser aproximadamente 70% da largura. A diferença entre 70% da largura e a altura deve ser no màximo 200px, e no mínimo -50.`)
    client.db.ref(`Users/${message.author.id}/wallpaper`).set({
      attachment: attachment.attachment || null,
      height: attachment.height || null,
      width: attachment.width || null
    });
    message.reply(`Novo background escolhido com sucesso!`)
  }
}