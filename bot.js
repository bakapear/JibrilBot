const Discord = require("discord.js");
const bot = new Discord.Client();
var request = require ("request");

if(process.env.BOT_TOKEN != undefined) {
	//bot.login(process.env.BOT_TOKEN);
	//enable for heroku support
}
else { //for local testing
	bot.login(require("./config.json").token);
}

bot.on("ready", () => {
	console.log(`Your personal servant ${bot.user.tag} is waiting for orders! oWo`);
	bot.user.setPresence({game:{name:"with master",type:0}});
});

bot.on("message", (msg) => {
	if (msg.author.bot || !msg.content.startsWith(".")) return;
	const args = msg.content.slice(1).split(" ");
	const cmd = args.shift().toLowerCase();
	switch(cmd) {
		case "ping":{
			const date = Date.now();
			msg.channel.send("Pinging...").then(m => {
				const newdate = Date.now() - date;
				if(newdate <= 500) {
					m.edit(`Pong! It took **${newdate}ms**, desu!`);
				}
				else {
					m.edit(`Pong! It took **${newdate}ms**!? Fix it b-baka!`);
				}
			}); 
			break; }
		case "pong":{
			msg.channel.send("So you wanna play that game? oWo");
			break; }
		case "roll":{
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
			msg.channel.send(`:game_die: ${msg.author.username} rolled a **${rnd}**!`);
			break; }
		case "status":{
			if(!msg.member.permissions.has("ADMINISTRATOR")) return;
			if(args.length >= 1) {
				bot.user.setPresence({game:{name:msg.content.slice(7),type:0}});
				msg.channel.send(`My status was changed by ${msg.author.username}!`);
			}
			else {
				msg.channel.send(`My current status is: ${bot.status}!`);
			}
			break; }
		case "say":{
			msg.delete();
			msg.channel.send(msg.content.slice(4));
			break; }
		case "8ball":{
			switch(Math.floor(Math.random() * (20 - 1 + 1)) + 1) {
				case 1: msg.channel.send(":8ball: It is certain"); break;
				case 2: msg.channel.send(":8ball: It is decidedly so"); break;
				case 3: msg.channel.send(":8ball: Without a doubt"); break;
				case 4: msg.channel.send(":8ball: Yes definitely"); break;
				case 5: msg.channel.send(":8ball: You may rely on it"); break;
				case 6: msg.channel.send(":8ball: As I see it, yes"); break;
				case 7: msg.channel.send(":8ball: Most likely"); break;
				case 8: msg.channel.send(":8ball: Outlook good"); break;
				case 9: msg.channel.send(":8ball: Yes"); break;
				case 10: msg.channel.send(":8ball: Signs point to yes"); break;
				case 11: msg.channel.send(":8ball: Reply hazy try again"); break;
				case 12: msg.channel.send(":8ball: Ask again later"); break;
				case 13: msg.channel.send(":8ball: Better not tell you now"); break;
				case 14: msg.channel.send(":8ball: Cannot predict now"); break;
				case 15: msg.channel.send(":8ball: Concentrate and ask again"); break;
				case 16: msg.channel.send(":8ball: Don't count on it"); break;
				case 17: msg.channel.send(":8ball: My reply is no"); break;
				case 18: msg.channel.send(":8ball: My sources say no"); break;
				case 19: msg.channel.send(":8ball: Outlook not so good"); break;
				case 20: msg.channel.send(":8ball: Very doubtful"); break;
			}
			break; }
		case "choose":{
			const parts = msg.content.slice(7).split(",");
			if(parts.length < 2) {msg.channel.send("Please enter atleast 2 things to choose from!\n(seperated by \",\")"); return;}
			const rnd = Math.floor(Math.random() * parts.length);
			msg.channel.send(`I chose **${parts[rnd]}**, because why not!`);
			break; }
		case "cat":{
			request({
				url: "http://random.cat/meow.php",
				json: true
			}, function (error, response, body) {
				msg.channel.send(body);
			})
			break; }
	}

});