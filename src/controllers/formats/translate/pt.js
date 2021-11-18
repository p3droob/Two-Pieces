module.exports = function pt(client, category, cmd) {
  if (category == 'mention') {
    return {
      embeds: [
        {
          title: `Olá ${cmd.author.username}`,
          description: `Eu sou o **${client.user.username}**\n\n`
        }
      ]
    }
  }
  if (category == 'information') {
    if (cmd == 'ping') {
      return {
        embeds: [{description: `Meu \`Tempo de Resposta\` é ${client.ws.ping} milisegundos`}]
      }
    }
  } else if (category == 'configs') {
    if (cmd == 'lang') {
      return {
        reply: function(message, newLang) {
          return `${message.author}, a linguagem que eu responderei você agora é \`${newLang}\``
        }
      }
    }
  } else if (category == 'onepiece') {
    if (cmd == 'start') {
    return function(prefix){
      return {
      alreadyStart: `Você já começou!`,
      embeds: [{title: 'Antes de começar, saiba que:', description: `Inicialmente você começará com 70 mil \`Berries\`;\nVocê começa na classe mais baixa: \`Navegador\`\nO valor pela sua cabeça é de \`10\` Berries, e vai aumentando conforme você derrota outros piratas\n\n**Está pronto? Reaja com <:pirate:898347112167788644> e tente se tornar o rei dos piratas!**`}, {title: `Você começou!`, description: `Agora derrote um marinheiro de nível \`1\`, use \`${prefix}batalhar\``}]
      }
    }
    } else if (cmd == 'batalhar') {
      return function(prefix) {
        return {
          not: `Você não começou, use \`${prefix}start\``,
          first: (life) => {return{title:`Sua primeira batalha`, description:`Informação do oponente:\n\n❤️  | Vida: \`${life}\`\n⬆️ | Nível: \`1\`\n🍇 | Fruta: \`Nenhuma\``, footer: 'Envie atacar para realizar um ataque.'}},
          single: function(opponent, user, ataque, attack, interaction) {
              if (!interaction) return {embeds: [{
              title:`Batalha contra ${opponent.name}`, image: opponent.img,
              description: `**Oponente⬇️ | ⬇️Você**\n\n❤️ Vida: \`${opponent.life}\` | ❤️ Vida: \`${user.life}\`\n⬆️ Nível: \`${opponent.level}\` | ⬆️Level: \`${user.level}\`\n🍇Fruta: \`${opponent.fruit?.name || 'Nenhuma'}\` | 🍇Fruta: \`${user.fruit?.name || 'Nenhuma'}\``
              }]}
              
              return {embeds: [
              {
              title:`Batalha contra ${opponent.name}`, image: opponent.img,
              description: `**Oponente⬇️ | ⬇️Você**\n\n❤️ Vida: \`${opponent.life}\` | ❤️ Vida: \`${user.life}\`\n⬆️ Nível: \`${opponent.level}\` | ⬆️Level: \`${user.level}\`\n🍇Fruta: \`${opponent.fruit?.name || 'Nenhuma'}\` | 🍇Fruta: \`${user.fruit?.name || 'Nenhuma'}\``
              },
              {
                title: 'Ataque',
                description: `**${interaction?.user?.username}** usou **${attack[0]}** e causou ${attack[1]} de dano em \`${opponent?.name}\`\n\n**${opponent?.name}** usou **${ataque[0]}** e causou ${ataque[1]} de dano em \`${interaction?.user?.username}\`\n\n[Volte para a batalha](https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.id})`
              }
              ]}
          }
        }
      }
    }
  }
}