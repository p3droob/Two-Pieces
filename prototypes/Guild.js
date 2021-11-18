module.exports = async (Guild) => {
  Object.defineProperties(Guild.prototype, {
  'prefix': {
    get: async function getPrefix() {
      const prefix = await this.client.db.ref(`Guilds/${this.id}/prefix`).once('value').then(r => r.val()) || '!!';
      return prefix;
    } 
  }
});
}