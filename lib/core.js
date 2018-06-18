const Discord = require("discord.js");
let fs = require("fs");
let got = require("got");
let cleverbot = require('cleverbot.io');
let moment = require("moment");

global.bot = new Discord.Client();
global.boot = new Date();
global.lockChannel = null;
bot.login(process.env.BOT_TOKEN);

global.token_trivia = {};
global.voiceq = {};

bot.on("ready", () => {
	console.log(`Your personal servant ${bot.user.tag} is waiting for orders!`);
	rndPresence();
});

async function rndPresence() {
	let word = (await got("http://api.urbandictionary.com/v0/random", { json: true })).body.list[0].word;
	if (word) bot.user.setPresence({ game: { name: word.substring(0, 25), type: Math.floor(Math.random() * 4) } });
}

//Change presence every 10mins~
setInterval(rndPresence, 654321);

//Reset everytime at midnight
setInterval(function () {
	let time = moment().format("H:mm:ss");
	if (time === "0:00:00") {
		console.log("- Midnight reset! -");
		process.exit(0);
	}
}, 1000);

bot.on("message", async msg => {
	if (msg.content.startsWith(`<@${bot.user.id}>`)) {
		msg.channel.startTyping();
		let content = msg.content.slice(21);
		let cbot = new cleverbot(process.env.CBOT_USER, process.env.CBOT_KEY);
		cbot.setNick(msg.author.username);
		cbot.create(function (err, session) {
			cbot.ask(content, function (err, response) {
				msg.channel.send(response);
				msg.channel.stopTyping();
			});
		});
		return;
	}
	if (msg.author.bot || !(msg.content.startsWith(".") || msg.content.startsWith(",") || msg.content.startsWith("-"))) return;
	if (msg.content.startsWith(",")) {
		msg.content = msg.content.replace(",", ".");
		msg.delete();
	}
	let args = msg.content.slice(1).split(" ");
	let cmd = args.shift().toLowerCase();
	getFileData("cmds").then(files => {
		for (let i = 0; i < files.length; i++) {
			if (files[i].name.includes(cmd)) {
				if (lockChannel !== null && msg.channel !== lockChannel && msg.content !== ".cmdlock") {
					msg.channel.send("Commands only available in #" + lockChannel.name).then(m => {
						m.delete(2000)
						msg.delete(2000)
					})
					return;
				}
				if (files[i].permission != "" && !msg.member.permissions.has(files[i].permission)) {
					msg.channek.send("Invalid permissions!");
					return;
				}
				if (files[i].args > args.length) {
					msg.channel.send(`Usage: \`.${cmd} ${files[i].usage}\``);
					return;
				}
				files[i].command(msg, cmd, args);
				return;
			}
		}
	});
});


process.on('uncaughtException', err => {
	console.error('Caught Exception: ' + err);
});

process.on('unhandledRejection', err => {
	console.error('Unhandled Rejection: ' + err);
});


async function getFileData(dir) {
	let files = await fs.readdirSync("./lib/" + dir);
	let data = [];
	for (let i = 0; i < files.length; i++) {
		data.push(require(`./${dir}/${files[i]}`));
	}
	return data;
}