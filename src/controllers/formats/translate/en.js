module.exports = function en(client, category, cmd) {
  if (category == 'information') {
    if (cmd == 'ping') {
      return {
        embeds: [{description: `My \`Response Time\` is ${client.ws.ping} milliseconds`}]
      }
    }
  } else if (category == 'configs') {
    if (cmd == 'lang') {
      return {
        reply: function(message, newLang) {
          return `${message.author}, the language that i will response you now is \`${newLang}\``
        }
      }
    }
  } else if (category == 'onepiece') {
    if (cmd == 'start') {
      return function (prefix){
        return {
        alreadyStart: `You already started!`,
        embeds: [{title: 'Before start, know that:', description: `Initially you starts with 70k \`Berries\`;\You start on the lower class: \`Navigator\`\nThe value of you head is \`10\` Berries, and will increases as you defeat other pirates\n\n**You are ready? React with <:pirate:898347112167788644> and try to become the King of pirates!**`}, {title: "you've started", description: `Now defeat one sailor of level \`1\`, use \`${prefix}batalhar\``}]
        }
      }
    } else if (cmd == 'batalhar') {
      return function(prefix, life, fruit, moves) {
        return {
          not: `You not started, use \`${prefix}start\``,
          first: {title: 'Your first battle!',description: `Opponent information:\n\n❤️  | Life: \`5\`\n⬆️ | Nível: \`1\`\n🍇 | Fruit: \`Any\`\n👊 | Moves: ${['punch'].join(', ')}`,footer:'Send attack to attack'}
        }
      }
    }
  }
}