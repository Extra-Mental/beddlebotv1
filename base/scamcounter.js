const tmiClient = require(__dirname + "/logintmi.js").client;
const Permissions = require(__dirname + "/permissions.js");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../../secret/database.db");

Permissions.register("scam", "viewer", 1);
Permissions.register("scamadd", "mod broadcaster", 1);
Permissions.register("scamremove", "mod broadcaster", 1);
Permissions.register("scamset", "mod broadcaster", 1);

var ScamCount = 0;

function getData(callback) {
  db.get(
    "SELECT Number FROM scriptdata WHERE Name IS 'ScamCount'",
    function (err, row) {
      if (err) {
        console.log(err);
        callback("Scam Counter DB ERR");
        return;
      }
      callback(row.Number);
      return;
    }
  );
}
getData((Count) => {
  ScamCount = Count;
});

function writeData() {
  db.run(`UPDATE scriptdata SET Number=${ScamCount} WHERE Name='ScamCount'`);
}

tmiClient.on("message", async (channel, userstate, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  var Split = message.split(" ");
  var Command = Split[0].toLowerCase();

  if ((Command === "!scam") & Permissions.check(userstate, "scam")) {
    tmiClient.say(channel, `Scam count is ${ScamCount} Kappa ${Math.random()}`);
    return;
  }

  //permissions

  var Number = parseInt(Split[1]);
  if (isNaN(Number)) {
    //console.log("Not A number");
    return;
  }

  if (Command === "!scamadd") {
    ScamCount = ScamCount + Number;
  }
  if (Command === "!scamremove") {
    ScamCount = ScamCount - Number;
  }
  if (Command === "!scamset") {
    ScamCount = Number;
  }

  writeData();

  tmiClient.say(channel, "Scam count is " + Count + " Kappa");
});
