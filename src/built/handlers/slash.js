module.exports = async (client) => {
  const fs = require('fs');
  const {join} = require('path');
  const path = 'src/built/slashes';
        const categories = fs.readdirSync(path)

        for (const category of categories) {
            const commands = fs.readdirSync(`${path}/${category}`)

            for (const command of commands) {
                const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`))
                const cmd = new (commandClass)(client)
                if (cmd.name === 'buy') await cmd.loadOptions({
                  swords: cmd.options[1].choices,
                  fruits: cmd.options[0].choices,
                  items: cmd.options[2].choices
                })
                client.slashes.set(cmd.name, cmd);
                client.log(`${cmd.name} carregado`, { color: 'yellow', tags: ['Slash'] })
            }
        }

}