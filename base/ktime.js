const tmiClient = require(__dirname+'/logintmi.js').client;
var moment = require('moment-timezone');

tmiClient.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!time') {
		tmiClient.action(channel, moment().tz("Asia/Seoul").format('h:m a z'));
	}
});
