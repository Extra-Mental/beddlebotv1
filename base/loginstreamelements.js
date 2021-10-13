require("dotenv").config({ path: "secret/.env" });

const io = require("socket.io-client");
let JWT = process.env.streamElementsKey;
const socket = io("https://realtime.streamelements.com", {
  transports: ["websocket"],
});

function onConnect() {
  console.log("Successfully connected to the websocket");
  socket.emit("authenticate", {
    method: "jwt",
    token: JWT,
  });
}

function onDisconnect() {
  console.log("Disconnected from websocket"); // Reconnect
}

function onAuthenticated(data) {
  const { channelId } = data;
  console.log(`Successfully connected to channel ${channelId}`);
}

// Socket connected
socket.on("connect", onConnect);

// Socket got disconnected
socket.on("disconnect", onDisconnect);

// Socket is authenticated
socket.on("authenticated", onAuthenticated);

exports.socket = socket;
