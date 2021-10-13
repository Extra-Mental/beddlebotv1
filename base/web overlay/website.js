const express = require('express')
const app = express()
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const port = 3000
const Polldata = require(__dirname + "/../livepoll.js");

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/overlay/livepoll', (req, res) => {
  res.sendFile(__dirname + '/html/livepoll.html');
})

io.on('connection', (socket) => {

  //console.log("Socket Data: " + socket);

  function intervalFunc() {
    //console.log("sending data" + Polldata.livepolldata)

    socket.broadcast.emit('update', {
      msg: Polldata.livepolldata
    });
  };

  setInterval(intervalFunc, 1500);

});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
