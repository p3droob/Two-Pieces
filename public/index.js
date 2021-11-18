const socket = io();

const login = document.getElementById('username');
document.querySelector('.login') ? document.querySelector('.login').addEventListener('click', event => {
  if (!localStorage['username']) return location.href = 'https://discord.com/api/oauth2/authorize?client_id=898317942054350898&redirect_uri=https%3A%2F%2Fwww.two-pieces.tk%2Fcallback&response_type=token&scope=identify%20guilds';
}): null;

if (localStorage['id']) document.getElementById('profile_redirect') ? document.getElementById('profile_redirect').href = `/profile/${localStorage['id']}` : null;
let infos = ['avatar', 'id', 'username'];
for (let i of infos) {
  if (i == 'avatar') {
    if (localStorage[i]) document.querySelector(`#${i}`) ? document.querySelector(`#${i}`).src = localStorage[i] : null;
  }
  else {
    document.querySelector(`#${i}`) ? document.querySelector(`#${i}`).textContent = (localStorage[i] || 'login') : null;
  }
  }
if (location.pathname == '/callback') {
  let { hash } = location;
  const params = {};
  hash.slice(1, hash.length).split('&').forEach(p => {
    params[p.split('=')[0]] = p.split('=')[1]
  });
  socket.emit('requestUser', params);
  setTimeout(() => location.href = '/home', 1000);
}

socket.on('getUser', user => {
  document.querySelector('img#avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`;
  login.textContent = user.username;
  localStorage['avatar'] = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`;
  localStorage['id'] = user.id;
  localStorage['username'] = user.username;
});