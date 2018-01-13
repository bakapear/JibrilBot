const Discord = require("discord.js");
const client = new Discord.Client();
const cfg = require("./config.json");

client.on("ready", () => {
    console.log("I am ready!");
	client.user.setPresence({game:{name:"with master",type:0}});
});

client.on("message", (message) => {
	if (message.content === ".ping") {
		message.channel.send("testing");
	}
	else if (message.content === ".avatar") {
		message.channel.send(message.author.avatarURL);
	}
	else if (message.content === ".nani") {
		message.channel.send(user.username);
	}
});

client.login(cfg.token);