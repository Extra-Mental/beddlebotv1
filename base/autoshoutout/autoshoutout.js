const tmiClient = require(__dirname + "/../logintmi.js").client;
fs = require("fs");

var Cooldown = 1000 * 60 * 60 * 24; //After a day it will trigger again
var Blacklist = " streamelements nightbot streamlabs moobot beddlebot beddle"; //split by spaces

const CachePath = __dirname + "/cache.json";
var Cache = {};

if (!fs.existsSync(CachePath)) {
  console.log(
    "cache, json file does not exist, creating new one (this should not be a common message)"
  );
  fs.writeFileSync(CachePath, JSON.stringify([]), function (err) {
    if (err) return console.log(err);
  });
}

fs.readFileSync(CachePath, "utf8", function (err, data) {
  if (err) return console.log(err);
  console.log("loading shoutout cache: \n" + data);
  Cache = JSON.parse(data);
});

tmiClient.on("message", (channel, Userstate, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  if (Userstate.badges == null) {
    return;
  }
  if (Userstate.badges.partner == null) {
    return;
  }
  var User = Userstate[`display-name`];
  var URLNAme = Userstate.username;
  //console.log(User + " is varified!")
  if (User == channel) {
    return;
  }
  if (Blacklist.search(" " + User.toLowerCase()) >= 0) {
    return;
  }

  var Time = Date.now();

  if (User in Cache) {
    var Delta = Time - Cache[User];
    if (Delta > Cooldown) {
      delete Cache[User];
      //console.log("Removing cooldown: " + User + " " + (Cooldown - Delta))
    } else {
      //console.log("User under cooldown: " + User + " " + (Cooldown - Delta))
      //console.log(Cache)
      return;
    }
  }

  //looking for some kind of nick name for their official channel link
  console.log("");
  console.log(channel);
  console.log(Userstate);

  var Message = `Please make sure to follow this awesome streamer ${User}! twitch.tv/${User}`;
  //console.log(Message);
  tmiClient.action(channel, Message);
  Cache[User] = Time;
  console.log("Saving cache: \n" + Cache);

  fs.writeFileSync(CachePath, JSON.stringify(Cache), function (err) {
    if (err) return console.log(err);
  });
});

//nightbot - {"moderator":"1","subscriber":"3","partner":"1"}
//beddle - {"broadcaster":"1","subscriber":"3018","partner":"1"}
