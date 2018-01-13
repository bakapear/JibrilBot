const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === '.ping') {
    	message.reply('Pong!');
  	}
	else if (message.content === '.rnd') {
		message.reply(Math.round(Math.random() * (100 - 1) + 1));
	}
});

client.login(process.env.BOT_TOKEN);