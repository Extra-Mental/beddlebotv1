var livemonitor = require(__dirname+'/livemonitor.js');
var tmiClient = require(__dirname+'/logintmi.js').client;

var Bank = 0;
tmiClient.on("cheer", (channel, userstate, message) => {
    var cheer = userstate.bits;
    Bank = Bank + parseInt(cheer,10);
    tmiClient.action('#beddle', 'Bit bank: ' +  Bank);
    //console.log(Bank);
});

var LiveDelta = 0;
var Live = 0;
function checkLive() {

  Live = livemonitor.live;

  if(Live == 0){
    if(LiveDelta == 1){
      //Stream has ended
      LiveDelta = 0;
      console.log(`Stream has ended ${new Date()}`);
    }
  }else{
    if(LiveDelta == 0){
      //Stream has started
      LiveDelta = 1;
      console.log(`Stream has started ${new Date()}`);
      Bank = 0;
    }
  }
}

tmiClient.on('message', (channel, tags, message, self) => {

	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!bank') {
		console.log(`${channel}: @${tags.username} Bit Bank: ${Bank}`)
		tmiClient.action(channel, `@${tags.username} Bit Bank: ${Bank}`);
	}
});

setInterval(checkLive, 5000);
