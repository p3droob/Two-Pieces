module.exports = async (User) => {
  Object.defineProperties(User.prototype, {
  'type': {
    get: async function userInfo() {
      const getInfo = await this.client.db.ref(`Users/${this.id}`).once('value').then(r => r.val()) || {};
      let info;
      switch(getInfo.pirate) {
        case true:
        info = 1;
        break;
        case false:
        info = 2;
        break;
        case undefined:
        info = 0;
        break;
      }
      return info;
    }
  },
  'lang': {
    get: async function lang() {
      return await this.client.db.ref(`Users/${this.id}/lang`).once('value').then(r => r.val()) || 'pt';
    }
  }
  });
}