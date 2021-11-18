module.exports = async (Message) => {
  const { MessageEmbed } = require('discord.js');
  Message.prototype.respond = function respond(message, options) {
    let opt = {};
      let content = message;
      let embeds = message.embeds || options?.embeds || [];

      if (!options?.embeds || !message.embeds) {

        if (options instanceof MessageEmbed) embeds.push(options);
        if (message instanceof MessageEmbed) embeds.push(message);
      }
      if (typeof options == 'string') content = options;
      if (typeof message == 'string') content = message;
      return this.reply({allowedMentions: { repliedUser: false }, content, embeds, components: message.components || options?.components || []});
    };
}