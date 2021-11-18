const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const DiscordOauth2 = require("discord-oauth2");
const serv = require('http').Server(app);
app.get("/", (request, response) => {
  response.redirect('/home')
  const ping = new Date()
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
});
app.use(express.static("public"));
app.set('view engine', 'ejs');
serv.listen(process.env.PORT);
app.get('/callback', (req, res) => {
  res.render('pages/redirecting')
})
const io = require('socket.io')(serv, {});
const { Guild, User, Util, Interaction, Message } = require('discord.js');
require('./prototypes/index')(Guild, User, Message)

Array.prototype.random = function() {
return this[Math.floor(Math.random() * this.length)]
}

const client = new (require('./src/client'))({
  intents: 1795,
  partials: ["CHANNEL", "MESSAGE", "GUILD_MEMBER", "REACTION"],
});

const oauth = new DiscordOauth2({
	clientId: "898317942054350898",
	clientSecret: process.env.SECRET,
	redirectUri: "https://two-pieces.tk/home",
});

//pages ->
let pages = fs.readdirSync('views/pages').filter(p => !p.includes('personalizedCrew'))
console.log(pages)
pages.forEach(page => {
  page = page.replace('.ejs', '');
  app.get(`/${page}`, async (req, res) => {
    await res.render(`pages/${page}`, {
      process,
      db: client.db,
      crews: await client.db.ref('Crews').once('value').then(r => r.val()) || [],
      cliente: client
    })
  })
});
app.get('/crews/:id', async (request, response) => {
  const crews = await client.db.ref('Crews').once('value').then(r => r.val()) || [];
  if (!crews.find(c => c.id == request.params?.id)) return await response.render('pages/crew_404');
  
  let crew = crews.find(c => c.id == request.params?.id);
  await response.render(`pages/personalizedCrew`, {
    process,
    db: client.db,
    crew,
    cliente: client,
    })
})

//pages <-
io.sockets.on('connection', async socket => {
  console.log('conexão estabelecida')
  socket.on('requestUser', async (data) => {
    const userResult = await oauth.getUser(data.access_token).catch(e => e)
    if (userResult) socket.emit('getUser', userResult);
  })
})