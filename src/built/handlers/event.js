module.exports = async (client) => {
  const fs = require('fs');
  const construct = local => {
  const eventos = fs.readdirSync(`src/built/events/${local}/`).filter(x => x.endsWith('.js'));
    for(let file of eventos) {
      const l = require(`${process.cwd()}/src/built/events/${local}/${file}`);
      let nome = file.split('.')[0];
      client.on(nome, l.bind(null, client))
        }
    }
    ["client", "guild"].forEach(x => construct(x)) 
}