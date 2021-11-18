const fs = require('fs');
module.exports = async (client) => {
const pastas = fs.readdirSync(__dirname);
pastas.splice(pastas.indexOf('index.js'), 1);

for (const folder of pastas) {
  const arquivos = fs.readdirSync(__dirname + `/${folder}`);
  for (const arquivo of arquivos) {
    let file;
    if (arquivo.includes('.js')) file = require(`${__dirname}/${folder}/${arquivo}`);

    if (folder === 'bosses') client.bosses.set(file.name, file);
    if (folder === 'fruits') {
      client.fruits.set(file.name, file);
      file.aliases.forEach(x => client.allFruits.set(x, file.name))
    };
    if (folder === 'formats') {
      const folders2 = fs.readdirSync(`${__dirname}/formats`);
      for (let folder2 of folders2) {
        let files2 = fs.readdirSync(`${__dirname}/${folder}/${folder2}`);

        for (let file2 of files2) {
          if (folder2 == 'translate') client.lang[file2.replace('.js', '')] = require(`${__dirname}/${folder}/${folder2}/${file2}`)
        }
      }
    }
    if (folder === 'games') {
      const files2 = fs.readdirSync(`${__dirname}/${folder}`);
      for (let file2 of files2) {
          client.games[file2.replace('.js', '')] = require(`${__dirname}/${folder}/${file2}`);
      }
    }
  }
}
}