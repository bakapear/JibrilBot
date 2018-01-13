const Discord = require("discord.js");
const client = new Discord.Client();
if(process.env.BOT_TOKEN != undefined) {
	client.login(process.env.BOT_TOKEN);
}
else { //for local testing
	client.login(require("./config.json").token);
}

client.on("ready", () => {
	console.log("I'm ready oWo!");
});

client.on("message", (message) => {
	if (message.content === ".ping") {
		message.channel.send("Pong!");
	}
	else if (message.content === ".avatar") {
		message.channel.send(message.author.avatarURL);
	}
});