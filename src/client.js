const { Client, Collection, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js'),
firebase = require('firebase');
const { readdir } = require("fs");
const fs = require('fs');
const chalk = require('chalk')
const _ = require('lodash')
const { join } = require('path');

module.exports = class TwoPieces extends Client {
  constructor(options) {
    super(options);
    super.login(process.env.TOKEN);
    ['lang', 'games'].forEach(o => this[o] = {});
    ['aliases', 'commands', 'slashes', 'bosses', 'fruits', 'allFruits'].forEach(c => this[c] = new Collection());
    ['loadFirebase', 'loadConfigs', 'loadHandlers'].forEach(f => this[f]());
    this.embed = class TwoEmbed extends MessageEmbed {
      constructor(data={}) {
        super(data);
        this.setColor('#2f3136')
      }
    };
    this.row = class TwoRow extends MessageActionRow {
      constructor(data={}) {
        super(data)
      }
    }
    this.button = class TwoButton extends MessageButton {
      constructor(data={}, style) {
        super(data);
        this.setStyle(style || 'PRIMARY');
      }
    };
    }
  log(
        message,
        {
            tags = [],
            bold = false,
            italic = false,
            underline = false,
            reversed = false,
            bgColor = false,
            color = 'white'
        } = {}
    ) {
        const colorFunction = _.get(
            chalk,
            [bold, italic, underline, reversed, bgColor, color].filter(Boolean).join('.')
        )

        console.log(...tags.map(t => chalk.cyan(`[${t}]`)), colorFunction(message))
    }
  loadFirebase() {
    var firebaseConfig = {
    apiKey: process.env.apikey,
    authDomain: process.env.authDomain,
    projectId: 'nebula-center',
    storageBucket: process.env.storageBucket,
    messagingSenderId: "575653461657",
    appId: process.env.appId
  };
    firebase.initializeApp(firebaseConfig);
    this.log('Firebase Conectado com sucesso.', { color: 'green', tags: ['Database'] });
    return this.db = firebase.database();
  }
  msToTime(duration) {
 var seconds = Math.floor((duration / 1000) % 60),
 minutes = Math.floor((duration / (1000 * 60)) % 60),
 hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

 return hours.toString().replace('0-', '') + ' hora(s) ' + minutes.toString().replace('0-', '') + ' minuto(s) ' + seconds.toString().replace('0-', '') + ' segundos';
}
  loadHandlers() {
    ['event', 'command', 'slash'].forEach(f => require(`./built/handlers/${f}`)(this))
    
  }
  loadConfigs() {
    this.customEmojis = {
      beri: '<:beri:902559351745687632>',
      pirate: '<:pirate:898347112167788644>'
    }
    return require('./controllers/index.js')(this);
  }
}