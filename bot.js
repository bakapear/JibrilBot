const Discord = require("discord.js");
const bot = new Discord.Client();
if(process.env.BOT_TOKEN != undefined) {
	bot.login(process.env.BOT_TOKEN);
}
else { //for local testing
	bot.login(require("./config.json").token);
}

bot.on("ready", () => {
	console.log(`Your personal servant ${bot.user.tag} is waiting for orders! oWo`);
});

bot.on("message", (msg) => {
	if (msg.author.bot || !msg.content.startsWith(".")) return;
	const args = msg.content.slice(1).split(" ");
	const cmd = args.shift().toLowerCase();
	//console.log(`Command: ${cmd}\nArguments: ${args}\n`);
	switch(cmd) {
		case "ping": 
			const date = Date.now();
			msg.channel.send("Pinging...").then(m => {
				const newdate = Date.now() - date;
				if(newdate <= 500) {
					m.edit(`Pong! It took ${newdate}ms, desu!`);
				}
				else {
					m.edit(`Pong! It took ${newdate}ms!? Fix it b-baka!`);
				}
			}); 
			break;
		case "pong":
			msg.channel.send("So you wanna play that game? oWo");
			break;
		case "roll":
			if(args[0] == "help") {msg.channel.send(``);return;}
			var max = 6;
			var min = 1;
			if(args.length == 1) {
				max = parseInt(args[0]);
			}
			else if (args.length > 1) {
				min = parseInt(args[0]);
				max = parseInt(args[1]);
			}
			const rnd = Math.floor(Math.random() * (max - min + 1)) + min;
			msg.channel.send(`:game_die: ${msg.author.username} rolled a ${rnd}!`);
			break;
	}
});