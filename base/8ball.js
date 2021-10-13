const tmiClient = require(__dirname+'/logintmi.js').client;
const ball = require('8ball')

tmiClient.on('message', (channel, Userstate, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase().split(' ')[0] === '!8ball'){

		tmiClient.action(channel, `@${Userstate.username} - ${ball()}`);
	}
});
