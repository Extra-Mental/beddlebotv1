const tmiClient = require(__dirname+'/logintmi.js').client;

tmiClient.on('message', (channel, Userstate, message, self) => {
	// Ignore echoed messages.
	if(self) return;
  if(Userstate['user-id'] != '44374179'){return};
  //console.log("echod")

	if(message.toLowerCase().split(' ')[0] === '!echo'){
    var Split = message.split(' ');
    Split.shift();
    message = Split.join(' ');
    //console.log(message);
		tmiClient.say(channel, message);
	}
});
