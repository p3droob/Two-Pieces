module.exports = async (client) => {
  const fs = require('fs');
  fs.readdirSync('src/built/comandos/').forEach(local => {
    const comandos = fs.readdirSync(`src/built/comandos/${local}`).filter(arquivo => arquivo.endsWith('.js'))

        for(let file of comandos) {
            let puxar = require(`${process.cwd()}/src/built/comandos/${local}/${file}`)

            if(puxar.name) {
                client.commands.set(puxar.name, puxar)
            }
            if(puxar.aliases && Array.isArray(puxar.aliases))
            puxar.aliases.forEach(x => client.aliases.set(x, puxar.name))
        }
    })
}