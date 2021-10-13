require("dotenv").config({ path: "secret/.env" });
const tmi = require("tmi.js");

const client = new tmi.Client({
  options: { debug: false },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "BeddleBot",
    password: process.env.tmiOauth,
  },
  channels: ["beddle"],
});

client.connect();

exports.client = client;
