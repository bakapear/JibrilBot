const Discord = require("discord.js");
const client = new Discord.Client();
//const cfg = require("./config.json");

client.on("ready", () => {
    console.log(process.env.BOT_TOKEN);
});

client.on("message", (message) => {
	if (message.content === ".ping") {
		message.channel.send("testingu!");
	}
	else if (message.content === ".avatar") {
		message.channel.send(message.author.avatarURL);
	}
});

client.login(process.env.BOT_TOKEN);