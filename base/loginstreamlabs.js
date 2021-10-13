require("dotenv").config({ path: "secret/.env" });
const { exec } = require("child_process");
const express = require("express");
const app = express();

app.get("/streamlabs/auth", function (req, res) {
  res.send("Success");

  var Code = req.query.code;

  var Command = `curl --request POST \ "https://streamlabs.com/api/v1.0/token" \ -d "grant_type=authorization_code&client_id=${process.env.streamLabsClientID}&client_secret=${process.env.streamLabsClientSecret}&redirect_uri=http://139.180.171.105/streamlabs/token&code=${Code}"`;

  console.log(Command);

  exec(Command, (err, stdout, stderr) => {
    if (err) {
      //if node couldn't execute the command
      console.log("ERR");
      console.log(err);
      return;
    }

    console.log(`stdout: ${stdout}`);
  });
});

app.listen(80);
