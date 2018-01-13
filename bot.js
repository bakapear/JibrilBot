const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", () => {
    console.log("I am ready!");
});

bot.on("message", message => {
    if (message.content === ".ping") {
    	message.reply("Pong!");
  	}
	else if (message.content === ".rnd") {
		message.reply(Math.round(Math.random() * (100 - 1) + 1));
	}
	else if (message.content === ".quack") {
		switch(Math.round(Math.random() * (5 - 1) + 1)) {
			case 1:
				message.reply("Here, I brought you lunch. I-its not like I made it especially for you or anything, I just had some left over, okay!? Idiot!");
				break;
			case 2:
				message.reply("OH MY GOD IM SEEING BOTH THE JAPANESE AND US VOICE ACTORS FOR ASUKA LANGLEY ON THE WEEKEND!!!!!!!");
				break;
			case 3:
				message.reply("B-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-b-baka!");
				break;
			case 4:
				message.reply("I'm running out of ideas!");
				break;
			case 5:
				message.reply("I consider your class of demon very worthy, worthy to fight, and worthy to die!");
				break;
		}
	}
});

bot.login(process.env.BOT_TOKEN);