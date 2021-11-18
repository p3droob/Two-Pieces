module.exports = async (client, oldMessage, newMessage) => {
  if (oldMessage.content === newMessage.content) return;
  client.emit('messageCreate', newMessage)
}