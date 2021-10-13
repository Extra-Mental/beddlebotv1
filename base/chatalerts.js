var tmiClient = require(__dirname + "/logintmi.js").client;
var SESocket = require(__dirname + "/loginstreamelements.js").socket;

const fs = require("fs");
const path = "chatalertsettings.txt";
var Enabled = 1;
if (fs.existsSync(path)) {
  Enabled = fs.readFileSync(path, "utf8");
  console.log("Follow alert enabled: " + Enabled);
} else {
  fs.writeFile(path, "1", function () {});
}

var ReplayMessage = ["", ""];

function speak(Channel, Message) {
  tmiClient.action(Channel, Message);
  ReplayMessage = [Channel, Message];
}

SESocket.on("event:test", (data) => {
  //console.log('test event stream elements');
  //console.log(data);
  // Structure as on JSON Schema
});
SESocket.on("event", (data) => {
  if (Enabled == "0") {
    return;
  }

  //console.log('normal event stream elements');
  //console.log(data);
  // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update

  var Channel = "#beddle";
  var Type = data.type;
  var Username = data.data.username;
  var Amount = data.data.amount;
  var Message = data.data.message;

  if (Type == "follow") {
    //console.log(`${Username} just followed!`)
    speak(Channel, `${Username} just followed! beddleHi beddleHi beddleHi`);
  }

  if (Type == "tip") {
    //console.log(`${Username} just tipped $${Amount}!`)

    if (Message != "") {
      speak(
        Channel,
        `${Username} just tipped ${Amount} livers! | Message: ${Message} | You just got scammed! beddleDab beddleDab beddleDab`
      );
      return;
    }
    speak(
      Channel,
      `${Username} just tipped ${Amount} livers! | You just got scammed! beddleDab beddleDab beddleDab`
    );
  }
});

tmiClient.on("message", (channel, userstate, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  //Ban this spacific harrassing user: 77_777_777_77_777
  var Regex = "^(?:7*|_*)+$";
  var user = userstate["display-name"];
  if (user.search(Regex) != -1) {
    tmiClient.ban(channel, user, "banned for harrassment");
    return;
  }

  if (userstate.mod) {
    if (message.toLowerCase() == "!bb falerts disable") {
      Enabled = 0;
      speak(channel, `Follow alerts are now disabled.`);
    }
    if (message.toLowerCase() == "!bb falerts enable") {
      Enabled = 1;
      speak(channel, `Follow alerts are now enabled.`);
    }

    fs.writeFile(path, Enabled + "", function () {});
  }

  //Todo add user permissions instead of check for mod/owner
  if (!userstate.mod) {
    if (userstate["user-id"] != "44374179") {
      return;
    }
  }

  if (message.toLowerCase() === "!replay") {
    //console.log(ReplayMessage[0], "Replayed Message: " + ReplayMessage[1])
    tmiClient.action(ReplayMessage[0], "Replayed Message: " + ReplayMessage[1]);
  }
});

tmiClient.on("hosted", (channel, username, viewers, autohost) => {
  speak(
    channel,
    `${username} is now hosting this channel with ${viewers} viewers! beddleHype beddleHype beddleHype`
  );
});

tmiClient.on("raided", (channel, username, viewers) => {
  speak(
    channel,
    `Incoming raid from ${username}! Welcome all ${viewers} raiders! beddleHype beddleHype beddleHype`
  );
});

tmiClient.on(
  "subscription",
  (channel, username, method, message, userstate) => {
    //console.log(userstate);
    let Tier = ~~userstate["msg-param-sub-plan"] / 1000;
    var Prime = "";
    if (Tier + "" == "0") {
      Tier = 1;
      Prime = " with twitch prime";
    }
    if (message != null) {
      speak(
        channel,
        `${username} just T${Tier} subbed${Prime}! | Message: ${message} | Welcome to the club! beddleBeer beddleBeer beddleBeer`
      );
      return;
    }
    speak(
      channel,
      `${username} just T${Tier} subbed${Prime}! Welcome to the club! beddleBeer beddleBeer beddleBeer`
    );
  }
);

tmiClient.on(
  "resub",
  (channel, username, months, message, userstate, methods) => {
    //console.log(userstate);
    let tier = ~~userstate["msg-param-sub-plan"];
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
    var UserMessage = "";
    if (message != null) {
      UserMessage = `| Message: ${message} |`;
    } //If message is not null then include it in bot chat alert, else it will be left as empty text

    if (cumulativeMonths > 0) {
      speak(
        channel,
        `${username} just T${
          tier / 1000
        } resubbed for ${cumulativeMonths} months! ${UserMessage} Thank you for your extended support partner! beddleLove beddleLove beddleLove`
      );
      return;
    }

    speak(
      channel,
      `${username} just T${
        tier / 1000
      } resubbed! Thank you for your extended support! ${UserMessage} Thank you for your extended support partner! beddleLove beddleLove beddleLove`
    );
  }
);

var GiftSubMessage = "";
tmiClient.on(
  "subgift",
  (channel, username, streakMonths, recipient, methods, userstate) => {
    //console.log(userstate);
    let tier = ~~userstate["msg-param-sub-plan"];
    let senderCount = ~~userstate["msg-param-sender-count"];
    if (senderCount === 0) {
      return;
    } //Spam prevention
    GiftSubMessage = `${username} just gifted a T${
      tier / 1000
    } sub to ${recipient}! Totalling ${senderCount}! BeddleDance BeddleDance BeddleDance`;
    //console.log(GiftSubMessage);
    speak(channel, GiftSubMessage);
  }
);

tmiClient.on(
  "submysterygift",
  (channel, username, numbOfSubs, methods, userstate) => {
    //console.log(userstate);
    let senderCount = ~~userstate["msg-param-sender-count"];
    let tier = ~~userstate["msg-param-sub-plan"];
    if (senderCount === 0) {
      return;
    } //Spam prevention
    GiftSubMessage = `${username} just gifted ${numbOfSubs} T${
      tier / 1000
    } subs! Totalling ${senderCount}! BeddleDance BeddleDance BeddleDance`;
    //console.log(GiftSubMessage);
    speak(channel, GiftSubMessage);
  }
);

tmiClient.on("anongiftpaidupgrade", (channel, username, userstate) => {
  //console.log(userstate);
  speak(
    channel,
    `${username} is continuing their gift sub from an anonymous user! Thanks for sticking around partner! beddleLove beddleLove beddleLove`
  );
});

tmiClient.on("giftpaidupgrade", (channel, username, sender, userstate) => {
  //console.log(userstate);
  speak(
    channel,
    `${username} is continuing their gift sub from ${sender}! Thanks for sticking around partner! beddleLove beddleLove beddleLove`
  );
});
