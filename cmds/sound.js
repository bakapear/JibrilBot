const got = require("got");
const api_github = process.env.API_GITHUB;

module.exports = {
	name: ["sound", "snd"],
	desc: "Plays a sound from Metastruct/garrysmod-chatsounds repo.",
	permission: "",
	usage: "<query>",
	args: 1,
	command: async function (msg, cmd, args) {
		if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
		if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return; }
		if (voiceq[msg.guild.id].playing >= 1) { msg.channel.send("Something is already playing!"); return; }
		let player;
		if (args[0].startsWith("https://") || args[0].startsWith("http://")) {
			msg.member.voiceChannel.join().then(connection => {
				voiceq[msg.guild.id].playing = 3;
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
						voiceq[msg.guild.id].playing = 0;
					});
				});
				player.on("error", e => {
					console.log(e);
				});
			});
		}
		else {
			const body = (await got(`https://api.github.com/search/code?q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}+in:path+extension:ogg+path:sound/chatsounds/autoadd+repo:Metastruct/garrysmod-chatsounds&access_token=${api_github}`, { json: true, headers: { "User-Agent": "Jibril" } })).body;
			if (body.total_count < 1) { msg.channel.send("Nothing found!"); return; }
			msg.member.voiceChannel.join().then(connection => {
				voiceq[msg.guild.id].playing = 3;
				let mod = 0;
				if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.items.length);
				player = connection.playArbitraryInput(`https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/${encodeURIComponent(body.items[mod].path.trim())}`);
				player.setBitrate(96000);
				msg.channel.send({
					embed: {
						color: 14506163,
						title: "Playing Sound",
						description: `\`${body.items[mod].name}\``
					}
				});
				player.on("end", () => {
					voiceq[msg.guild.id].playing = 0;
				});
				player.on("error", e => {
					console.log(e);
				});
			});
		}
	}
}