const tmiClient = require(__dirname + "/logintmi.js").client;
const fusejs = require("fuse.js");

var MaxEntrys = 40; //Message to store
var MaxCharacters = 30; //Limit sort out shorter messages

const options = {
  isCaseSensitive: false,
  // includeScore: false,
  shouldSort: true,
  //includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.2, //Lower means closer match
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  keys: ["message"],
};

var ExportMessages = ["", "", ""];
var Messages = [];
var History = [];
var MaxTime = 0;

tmiClient.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  //Skip if message is too long
  if (message.length > MaxCharacters) {
    return;
  }

  //Record start time for perfomance
  var StartTime = Date.now();

  //Check if this message matches previous messages
  var fuse = new fusejs(Messages, options);
  var Match = fuse.search(message)[0];

  //if theres no match, make a new entry in messages and a new entry at the end of History for deletion
  if (!Match) {
    Messages.push({ count: 1, message: message });
    History.push(message);
  } else {
    //if there is a match, increase the count and add a copy of the matched phrase to history for deletion
    var Item = Match.item.message;
    var Index = Match.refIndex;

    //console.log("\n" + message + " matches:\n" + Item);

    //Increase the count
    Messages[Index].count += 1;
    History.push(Item);
  }

  //Check history to decrement counts and delete first history entry, if count reaches 0 then delete it
  while (History.length > MaxEntrys) {
    var FirstHistory = History.shift();
    Messages = Messages.filter((object) => {
      if (object.message == FirstHistory) {
        object.count -= 1;
        if (object.count <= 0) {
          return false;
        }
      }
      return true;
    });
  }

  //Sort the highest counts to the top
  Messages.sort((a, b) => {
    if (a.count < b.count) return 1;
    return -1;
  });

  exports.livepolldata = Messages;

  //Prevents errors for below logs
  if (Messages.length < 3) {
    return;
  }

  return; //Hide console logs
  //console.log(Messages);
  console.log("\nMessages count: " + Messages.length);
  console.log("History count: " + History.length + "/" + MaxEntrys);
  var ProcessTime = (Date.now() - StartTime) / 1000;
  if (ProcessTime > MaxTime) {
    MaxTime = ProcessTime;
  }
  console.log(
    "Process time: " + ProcessTime + "s | Top session time: " + MaxTime + "s"
  );
  console.log("\nTop 5 Similar Messages");
  console.log(Messages[0].count + " " + Messages[0].message);
  console.log(Messages[1].count + " " + Messages[1].message);
  console.log(Messages[2].count + " " + Messages[2].message);
});

tmiClient.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  if (message.toLowerCase() === "!livepoll") {
    tmiClient.action(
      channel,
      `Poll: ${Messages[0].count + "x " + Messages[0].message} | ${
        Messages[1].count + "x " + Messages[1].message
      } | ${Messages[2].count + "x " + Messages[2].message}`
    );
  }
});

exports.livepolldata = Messages;
