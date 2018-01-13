const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === '.ping') {
    	message.reply('Pong!');
  	}
	else if (message.content === '.sex') {
		message.reply(Math.random());
	}
	else if (message.conent === '.rnd') {
		
	}
});

client.login(process.env.BOT_TOKEN);