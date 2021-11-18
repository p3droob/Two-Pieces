module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;

  try {
    (client.slashes.get(interaction.commandName)).run(interaction);
    
  } catch (e) {
    console.log(e)
  }
}