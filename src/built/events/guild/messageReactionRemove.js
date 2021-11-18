module.exports = async (client, reaction, user) => {
  const message = reaction.message;

  if (message.id != '907376380709314631') return;
  const member = message.guild.members.cache.get(user.id);
  switch(reaction._emoji.name) {
    case '🍇':
    member.roles.remove('899418815459389440');
    break;
    case '☠️':
    member.roles.remove('899420561476812890');
    break;
    case '⛵':
    member.roles.remove('909854291798409297');
    break;
  }
}