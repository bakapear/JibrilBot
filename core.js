const boot = new Date();

const Discord = require("discord.js");
const bot = new Discord.Client();
const request = require("request");
const yt = require("ytdl-core");
const google = require("google");
const fs = require("fs");

bot.login(process.env.BOT_TOKEN);
const api_google = process.env.API_GOOGLE;
const api_search = process.env.API_SEARCH;
const api_osu = process.env.API_OSU;
const api_steam = process.env.API_STEAM;
const api_github = process.env.API_GITHUB;
const api_musix = process.env.API_MUSIX;

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
		files.forEach(file => {
			if(file.name.includes(cmd)) {
				if(file.permission != "" && !msg.member.permissions.has(file.permission)) {
					msg.channek.send("Invalid permissions!");
					return;
				}
				if(file.needargs == true && args == "") {
					msg.channel.send("Invalid arguments!");
					return;
				}
				file.command(boot, msg, cmd, args, bot);
			}
		});
	})
});