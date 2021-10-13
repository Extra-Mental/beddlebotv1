const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../../secret/database.db");

//Groups: Viewer/Mod/VIP/Broadcaster/T1Sub/T2Sub/T3Simp... I mean T3Sub

const AvailablePerms = ["viewer", "sub", "vip", "mod", "broadcaster"];

var Memory = {}; //To save on command delay

function getData(Command, Callback) {
  db.all(
    `SELECT Command, Perms, Permanent FROM permissions WHERE Command IS ?`,
    [Command],
    function (err, row) {
      if (err) {
        console.log(err);
        Callback("Permissions DB ERR");
        return;
      }
      Callback(row);
      return;
    }
  );
}
//getData((Count) => {ScamCount = Count});

function writeData(Command, Perms, Permantent) {
  db.run(`INSERT INTO permissions VALUES(?,?,?)`, [Command, Perms, Permantent]);
}

//Register structure
//Check if command has an entry in db
//if it exists then copy contents to memory array
//if it doesnt then make a new entry and write new data to db and memory for fast access later
function RegisterPerm(Command, Defaults, Permanent) {
  //Check if strings
  if (typeof Command === "string" && typeof Defaults === "string") {
    //make command lower case to prevent doubles
    Command = Command.toLowerCase();

    getData(Command, (Row) => {
      //Entry rows are given here
      //if data exists copy the db perms to memory as and array in [0] and Permanency in [1]. forget the initial default given and use the ones from the DB
      if (Row.length > 0) {
        var RowArray = Row[0];
        console.log("Command entry exists in DB");
        console.log(RowArray);
        Memory[RowArray.Command] = [
          JSON.parse(RowArray.Perms),
          RowArray.Permanent,
        ];
        console.log(
          `Perms: added command ${RowArray.Command} with perms ${
            Memory[RowArray.Command]
          }, Permanent: ${RowArray.Permanent} to memory, exisits in DB`
        );
        return true;
      }

      //console.log("Permissions do not exist for this command")

      //lower the defaults for no caps
      Defaults = Defaults.toLowerCase();

      //Split default string into array
      var DefaultsSplit = Defaults.split(" ");
      var Skip = 0;
      DefaultsSplit.forEach(function (value) {
        if (!AvailablePerms.includes(value)) {
          Skip = 1;
        } //If permission doesnt exist in AvailablePerms, return false
      });
      if (Skip == 1) {
        return false;
      }

      //console.log(JSON.stringify(DefaultsSplit))
      writeData(Command, JSON.stringify(DefaultsSplit), Permanent);
      Memory[Command] = [DefaultsSplit, Permanent];
      console.log(
        `Perms: added command ${Command} with perms ${DefaultsSplit}, Permanent: ${Permanent} to memory and database`
      );
      return true;
    });
    return false;
  }

  console.log(typeof Command);
  console.log(typeof Defaults);
  console.log("Permission register arguments are not strings");
  return false;
}

//RegisterPerm("test", "mod viewer", 0);

function CheckPerm(Userstate, Command) {
  Command = Command.toLowerCase();

  //Error if command doesnt exist
  if (!Memory[Command]) {
    console.log(`Permission ${Command} doesn't exist`);
    return false;
  }

  var Broadcaster = Userstate.badges.broadcaster;
  var Mod = Userstate.mod;
  var VIP = Userstate.badges.vip;
  var Sub = Userstate.subscriber;

  var Perms = Memory[Command][0];

  if (Sub) {
    if (Perms.includes("sub")) {
      return true;
    }
  }
  if (VIP) {
    if (Perms.includes("vip")) {
      return true;
    }
  }
  if (Mod) {
    if (Perms.includes("mod")) {
      return true;
    }
  }
  if (Broadcaster) {
    if (Perms.includes("broadcaster")) {
      return true;
    }
  }
  if (Perms.includes("viewer")) {
    return true;
  }
  return false;
}

function GetPerms(Command) {
  Command = Command.toLowerCase();
  if (!Memory[Command]) {
    return [false, "no command"];
  }
  return [true, Memory[Command][0].join(" ")];
}

function AddPerms(Userstate, Command, Perms) {
  Command = Command.toLowerCase();
  //Check if commands exist
  if (!Memory[Command]) {
    return [false, "no command"];
  }

  //Split given perms and check if they are a part of AvailablePerms
  Perms = Perms.toLowerCase();
  var PermsSplit = Perms.split(" ");
  var Skip = 0;
  PermsSplit.forEach(function (value) {
    if (!AvailablePerms.includes(value)) {
      Skip = 1;
    } //If permission doesnt exist in AvailablePerms, return false
  });
  if (Skip == 1) {
    return [false, "permission"];
  }

  //Check if permission already exists for given command, if not then do nothing

  PermsSplit.forEach(function (value) {
    if (!Memory[Command][0].includes(value)) {
      Memory[Command][0].push(value);
    }
  });
  writeData(Command, JSON.stringify(DefaultsSplit), Memory[Command][1]);
  return [true, Memory[Command][0].join("")]; //Return true and return all current permissions
}

function DeletePerms(Userstate, Command, Perms) {
  Command = Command.toLowerCase();
  //Check if commands exist
  if (!Memory[Command]) {
    return [false, "no command"];
  }

  Perms = Perms.toLowerCase();
  var PermsSplit = Perms.split(" ");
  //removal code
}

tmiClient.on("message", (channel, Userstate, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  var Broadcaster = Userstate.badges.broadcaster;
  var Mod = Userstate.mod;
  var Dev = Userstate["user-id"] == "44374179" ? true : false;

  if (!Broadcaster && !Mod && !Dev) {
    return;
  }

  if (message.toLowerCase() === "!getperms") {
  }
  if (message.toLowerCase() === "!addperms") {
  }
  if (message.toLowerCase() === "!deleteperms") {
  }
  if (message.toLowerCase() === "!getperms") {
  }
});

exports.register = RegisterPerm;
exports.check = CheckPerm;
exports.delete = DeletePerm;
