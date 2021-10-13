const tmiClient = require(__dirname + "/logintmi.js").client;

tmiClient.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  if (message.toLowerCase() === "!ping") {
    console.log(`${channel}: Pong! @${tags.username}`);
    tmiClient.action(channel, `Pong! @${tags.username}`);
  }
});
