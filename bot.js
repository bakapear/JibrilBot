const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('I am ready!');
	bot.user.setGame('with ahmad');
});

bot.on('message', message => {
    if (message.content === '.ping') {
    	message.reply('Pong!');
  	}
	else if (message.content === '.rnd') {
		message.reply(Math.round(Math.random() * (100 - 1) + 1));
	}
	else if (message.content === '.test') {
		bot.user.setPresence({ status: 'online', game: { name: 'with ahmad' } });
	}
});

bot.login(process.env.BOT_TOKEN);