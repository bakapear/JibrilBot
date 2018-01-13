const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on('message', message => {
    if (message.content === '.ping') {
    	message.reply('Pong!');
  	}
	else if (message.content === '.rnd') {
		message.reply(Math.round(Math.random() * (100 - 1) + 1));
	}
	else if (message.content === '.test') {
		message.reply('Here, I brought you lunch. I-its not like I made it especially for you or anything, I just had some left over, okay!? Idiot!');
	}
});

bot.login(process.env.BOT_TOKEN);