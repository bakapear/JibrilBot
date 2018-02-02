const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const boot = new Date();
bot.login(process.env.BOT_TOKEN);

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
	if (msg.author.bot || !(msg.content.startsWith(".") || msg.content.startsWith(",") || msg.content.startsWith("-"))) return;
	if (msg.content.startsWith(",")) {
		msg.content = msg.content.replace(",",".");
		msg.delete();
	}
	const args = msg.content.slice(1).split(" ");
	const cmd = args.shift().toLowerCase();
	getFileData("./cmds").then(files => {
		let filenames = [];
		files.forEach(file => {
			if(cmd == "help") {
				if(file.name.includes(args[0])) {
					msg.channel.send({embed: {
						color: 11321432,
						author: {
						name: `.${args[0]} [${file.name}]`,
						icon_url: "https://i.imgur.com/4AEPwtC.png"
						},
						description: `${file.desc}\nUsage: \`.${args[0]} ${file.usage}\``
					}});
					return;
				}
				if(args == "") {
					filenames.push(file.name);
				}
				if(filenames.length == files.length) {
					msg.channel.send({embed: {
						color: 11321432,
						author: {
						name: `Command Help`,
						icon_url: "https://i.imgur.com/4AEPwtC.png"
						},
						description: `\`${filenames.join("|")}\``
					}});
				}
			}
			if(file.name.includes(cmd)) {
				if(file.permission != "" && !msg.member.permissions.has(file.permission)) {
					msg.channek.send("Invalid permissions!");
					return;
				}
				if(file.args > args.length) {
					msg.channel.send("Invalid arguments!");
					return;
				}
				file.command(boot, msg, cmd, args, bot);
				return;
			}
		});
	})
});