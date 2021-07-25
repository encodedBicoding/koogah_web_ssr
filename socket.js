
const app = require('./app');
const WebSocket = require('ws');
const http = require('http');
const eventEmitter = require('./event');

const server = http.createServer(app);
const port = process.env.PORT || 8080;


const WsServer = new WebSocket.Server({
  noServer: true
});

WsServer.on('request', function (req) {
  console.log(req.origin);
});

server.on('upgrade', function upgrade(request, socket, head) { 
  console.log(`worker ${process.pid} is upgrading...`);
try {
    WsServer.handleUpgrade(request, socket, head, (ws) => {
      WsServer.emit('connection', ws, request, socket);
    });
} catch (err) {
  console.log(err);
  return;
}
});

WsServer.on('connection', async function (ws, req, client) {
  try {
    if (ws.readyState === WebSocket.OPEN) {
      ws.on('message', async function (message) {
        let msg = JSON.parse(message);
        if (msg.event === 'check_location') {
          console.log('got here');
          eventEmitter.emit('check_location', {
            longitude: msg.longitude,
            latitude: msg.latitude,
          })
        }
      })
    }
  } catch (err) {
    console.log(err);
  }
})

server.listen(port, () => {
  console.log(`listening on ${port}, ws running too`);
});
module.exports = WsServer;