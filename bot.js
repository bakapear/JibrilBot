const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('I am ready!');
});

bot.on('message', message => {
    if (message.content === '.ping') {
    	const m = await message.channel.send("Ping?");
		m.edit("Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms");
  	}
	else if (message.content === '.rnd') {
		message.reply(Math.round(Math.random() * (100 - 1) + 1));
	}
	else if (message.content === '.test') {
		setPresence({ status: 'online', game: { name: 'GAME' } })
	}
});

bot.login(process.env.BOT_TOKEN);