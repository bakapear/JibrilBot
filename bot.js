const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});
bot.on("disconnected", function () {
    console.log("I left!");
    process.exit(1);
});

client.on('message', message => {
    if (message.content === '.ping') {
    	message.reply('Pong!');
  	}
	else if (message.content === '.rnd') {
		message.reply(Math.round(Math.random() * (100 - 1) + 1));
	}
	else if (message.content === '.test') {
		client.user.setGame('with Ahmad');
	}
});

client.login(process.env.BOT_TOKEN);