const Discord = require("discord.js");
let fs = require("fs");
let util = require("util");
let cleverbot = require('cleverbot.io');
let moment = require("moment");

global.bot = new Discord.Client();
global.boot = new Date();
bot.login(process.env.BOT_TOKEN);

global.token_trivia = {};
global.voiceq = {};

bot.on("ready", () => {
	console.log(`Your personal servant ${bot.user.tag} is waiting for orders!`);
	bot.user.setPresence({ game: { name: "with master", type: 0 } });
});

function getFileData(dir) {
	return new Promise(resolve => {
		fs.readdir(dir, (err, files) => {
			let data = [];
			files.forEach((file, num) => {
				data.push(require(`${dir}/${file}`));
				if (num >= files.length - 1) {
					resolve(data);
				}
			});
		});
	});
}

bot.on("message", msg => {
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
	getFileData("./cmds").then(files => {
		let filenames = [];
		let subcount = 0;
		files.forEach(file => {
			if (cmd == "help") {
				if (args == "") {
					filenames.push(file.name);
					subcount += file.name.length;
				}
				else if (file.name.includes(args[0])) {
					msg.channel.send({
						embed: {
							color: 11321432,
							author: {
								name: `.${args[0]} [${file.name}]`,
								icon_url: "https://i.imgur.com/4AEPwtC.png"
							},
							description: `${file.desc}\nUsage: \`.${args[0]} ${file.usage}\``
						}
					});
					return;
				}
				if (filenames.length == files.length) {
					msg.channel.send({
						embed: {
							color: 11321432,
							author: {
								name: `Commands (${subcount} in ${filenames.length})`,
								icon_url: "https://i.imgur.com/4AEPwtC.png"
							},
							description: `\`${filenames.join("|")}\`\n\nUsage: \`.help <cmd>\``
						}
					});
				}
			}
			if (file.name.includes(cmd)) {
				if (file.permission != "" && !msg.member.permissions.has(file.permission)) {
					msg.channek.send("Invalid permissions!");
					return;
				}
				if (file.args > args.length) {
					msg.channel.send(`Usage: \`.${cmd} ${file.usage}\``);
					return;
				}
				file.command(msg, cmd, args);
				return;
			}
		});
	});
});

//Reset everytime at midnight
setInterval(function () {
	let time = moment().format("H:mm:ss");
	if (time === "0:00:00") {
		console.log("- Midnight reset! -");
		process.exit(0);
	}
}, 1000);

process.on('uncaughtException', err => {
	console.error('Caught Exception: ' + util.inspect(err, false, null));
});

process.on('unhandledRejection', err => {
	console.error('Unhandled rejection: ' + util.inspect(err, false, null));
});
