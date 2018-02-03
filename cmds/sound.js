const core = require("../core.js");
const bot = core.bot;
const request = require("request");
const api_github = process.env.API_GITHUB;

module.exports = {
	name: ["sound", "snd"],
	desc: "Plays a sound from Metastruct/garrysmod-chatsounds repo.",
	permission: "",
	usage: "<query>",
	args: 1,
	command: function (msg, cmd, args) {
		if (!msg.member.voiceChannel) {
			msg.channel.send("You're not in a voice channel!");
			return
		}
		let player;
		if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
			if (args[0].startsWith("https://") || args[0].startsWith("http://")) {
				msg.member.voiceChannel.join().then(connection => {
					player = connection.playArbitraryInput(args[0]);
					player.setBitrate(96000);
					msg.channel.send({
						embed: {
							color: 14506163,
							title: "Playing Soundfile",
							description: `\`${args[0]}\``
						}
					}).then(m => {
						player.on("end", () => {
							msg.member.voiceChannel.leave()
						});
					});
					player.on("error", e => {
						console.log(e);
					});
				});
			}
			else {
				request({
					url: `https://api.github.com/search/code?q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}+in:path+extension:ogg+path:sound/chatsounds/autoadd+repo:Metastruct/garrysmod-chatsounds`,
					qs: {
						access_token: api_github
					},
					headers: {
						"User-Agent": "Jibril"
					},
					json: true
				}, function (error, response, body) {
					if (body.total_count < 1) {
						msg.channel.send("Nothing found!");
					}
					else {
						msg.member.voiceChannel.join().then(connection => {
							let mod = 0;
							if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.items.length);
							let link = `https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/${encodeURIComponent(body.items[mod].path.trim())}`;
							player = connection.playArbitraryInput(link);
							player.setBitrate(96000);
							msg.channel.send({
								embed: {
									color: 14506163,
									title: "Playing Sound",
									description: `\`${body.items[mod].name}\``
								}
							});
							player.on("end", () => {
								msg.member.voiceChannel.leave();
							});
							player.on("error", e => {
								console.log(e);
							});
						});
					}
				});
			}
		}
		else {
			msg.channel.send(`Something is already playing!`);
		}
	}
}