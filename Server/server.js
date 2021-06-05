// //const loginharvester = require('../Captcha/login')
// //const harvestersinfo = require('../HarvestersInfo/harvesters.json')
// async function server(){
//   const ReconnectingWebSocket = require('reconnecting-websocket');
//   const rws = new ReconnectingWebSocket('ws://localhost:4500');
// }
// module.exports = server;
// server()
// const io = require('socket.io')();
// io.on('connection', client => {
//   console.log('connected')
// });
// io.listen(3000);
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => {console.log('user connected')});
io.on("connection", (socket) => {
    socket.emit("hello", "world");
  });
server.listen(3000);
