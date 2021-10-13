require("dotenv").config({ path: "secret/.env" });
var tmiClient = require(__dirname + "/logintmi.js").client;
var request = require("request");
var options = {
  url: `https://api.twitch.tv/kraken/streams/${process.env.BeddleChannelID}`,
  headers: {
    Accept: "application/vnd.twitchtv.v5+json",
    "Client-ID": "" + process.env.TwitchAPIClientID,
  },
};

function IsJSON(jsonString) {
  try {
    var JS = JSON.parse(jsonString);

    if (JS && typeof JS === "object") {
      return JS;
    }
  } catch (e) {}

  return false;
}

var LiveDelta = 0;

function checkLive() {
  request.get(options, function (error, response, body) {
    if (error) {
      console.log("live monitor error: " + error);

      return;
    }

    if (IsJSON(body) == false) {
      console.log("Non JSON, rejecting");
      return;
    }

    var Data = JSON.parse(body);

    if (Data.stream == null) {
      if (LiveDelta == 1) {
        //Stream has ended
        LiveDelta = 0;
        //console.log('Stream has ended');
      }
    } else {
      if (LiveDelta == 0) {
        //Stream has started
        LiveDelta = 1;
        //console.log('Stream has started');
        //speak(Channel, `${Username} just tipped ${Amount} livers! | Message: ${Message} | You just got scammed! beddleDab beddleDab beddleDab`);
      }
    }
  });
  exports.live = LiveDelta;
}

setInterval(checkLive, 5000);

exports.live = LiveDelta;
