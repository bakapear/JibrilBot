const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("I am ready!");
	client.user.setGame("on ${client.guilds.size} servers");
});

client.on("message", function(message) {
        client.sendMessage(message, "Hello!");
});

client.login(process.env.BOT_TOKEN);