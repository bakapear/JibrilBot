const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {
    console.log("I am ready!");
});

bot.on("message", function(message) {
        bot.sendMessage(message, "Hello!");
});

bot.login(process.env.BOT_TOKEN);