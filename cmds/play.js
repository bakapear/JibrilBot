const yt = require("ytdl-core");
const got = require("got");
const api_google = process.env.API_GOOGLE;
let player;

module.exports = {
	name: ["play", "ply"],
	desc: "Plays a youtube video or playlist in the voicechannel.",
	permission: "",
	usage: "<query> | <videoURL> | <playlistURL> (shuffle)",
	args: 1,
	command: async function (msg, cmd, args) {
		if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
		if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return }
		if (voiceq[msg.guild.id].playing >= 1 && voiceq[msg.guild.id].playing != 1) { msg.channel.send("Something is already playing!"); return; }
		let playlist = formatPlaylistId(args[0]);
		if (playlist != -1) {
			const res = await got(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlist}&key=${api_google}`, { json: true });
			if (!res.body.items) { msg.channel.send("No Playlist found!"); return; }
			if (res.body.items.length < 1) { msg.channel.send("Nothing found in Playlist!"); return; }
			let songlist = [];
			for (i = 0; i < res.body.items.length; i++) {
				songlist.push([res.body.items[i].snippet.resourceId.videoId, res.body.items[i].snippet.title, res.body.items[i].snippet.thumbnails.medium.url, res.body.items[i].snippet.thumbnails.default.url]);
			}
			if (args[1] == "shuffle") {
				shuffle(songlist);
			}
			for (i = 0; i < songlist.length; i++) {
				voiceq[msg.guild.id].songs.push([songlist[i][0], songlist[i][1], songlist[i][2], songlist[i][3]]);
			}
			if (voiceq[msg.guild.id].playing == 0) {
				msg.member.voiceChannel.join().then(connection => {
					voiceq[msg.guild.id].playing = 1;
					msg.channel.send({
						embed: {
							color: 14506163,
							title: "Now Playing",
							url: `https://youtube.com/watch?v=${voiceq[msg.guild.id].songs[0][0]}`,
							description: `\`${voiceq[msg.guild.id].songs[0][1]}\``,
							image: {
								url: voiceq[msg.guild.id].songs[0][2]
							}
						}
					});
					player = connection.playStream(yt(voiceq[msg.guild.id].songs[0][0], { audioonly: true }));
					player.setBitrate(96000);
					player.on("end", () => {
						voiceq[msg.guild.id].songs.shift();
						if (!voiceq[msg.guild.id].songs.length < 1) {
							next(msg, cmd, args, connection);
							return;
						}
						voiceq[msg.guild.id].playing = 0;
					});
				});
			}
			else {
				msg.channel.send({
					embed: {
						color: 14506163,
						title: "Added Playlist to Queue",
						description: `\`${songlist.length} Videos\``,
						thumbnail: {
							url: res.body.items[0].snippet.thumbnails.default.url
						}
					}
				});
			}
		}
		else {
			let videoid;
			if (args[0].startsWith("https://") || args[0].startsWith("http://")) {
				videoid = formatVideoId(msg.content.slice(cmd.length + 1));
				if (videoid == -1) { msg.channel.send("Invalid Link!"); return; }
			}
			else {
				const res = await got(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&key=${api_google}`, { json: true });
				if (res.body.items.length < 1) { msg.channel.send("Nothing found!"); return; }
				let mod = 0;
				if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * res.body.items.length);
				videoid = res.body.items[mod].id.videoId;
			}
			const res2 = await got(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoid}&key=${api_google}`, { json: true });
			if (res2.body.items.length < 1) { msg.channel.send("Nothing found!"); return; }
			voiceq[msg.guild.id].songs.push([videoid, res2.body.items[0].snippet.title, res2.body.items[0].snippet.thumbnails.medium.url]);
			if (voiceq[msg.guild.id].playing == 0) {
				msg.member.voiceChannel.join().then(connection => {
					voiceq[msg.guild.id].playing = 1;
					msg.channel.send({
						embed: {
							color: 14506163,
							title: "Now Playing",
							description: `\`${voiceq[msg.guild.id].songs[0][1]}\``,
							url: `https://youtube.com/watch?v=${voiceq[msg.guild.id].songs[0][0]}`,
							image: {
								url: voiceq[msg.guild.id].songs[0][2]
							}
						}
					});
					player = connection.playStream(yt(voiceq[msg.guild.id].songs[0][0], { audioonly: true }));
					player.setBitrate(96000);
					player.on("end", () => {
						voiceq[msg.guild.id].songs.shift();
						if (!voiceq[msg.guild.id].songs.length < 1) {
							next(msg, cmd, args, connection);
							return;
						}
						voiceq[msg.guild.id].playing = 0;
					});
				});
			}
			else {
				msg.channel.send({
					embed: {
						color: 14506163,
						title: "Added to Queue",
						description: `\`${res2.body.items[0].snippet.title}\``,
						url: `https://youtube.com/watch?v=${videoid}`,
						thumbnail: {
							url: res2.body.items[0].snippet.thumbnails.default.url
						}
					}
				});
			}
		}
	},
	end: function () {
		player.end();
	}
}

function next(msg, cmd, args, connection) {
	voiceq[msg.guild.id].playing = 1;
	msg.channel.send({
		embed: {
			color: 14506163,
			title: "Now Playing",
			description: `\`${voiceq[msg.guild.id].songs[0][1]}\``,
			url: `https://youtube.com/watch?v=${voiceq[msg.guild.id].songs[0][0]}`,
			image: {
				url: voiceq[msg.guild.id].songs[0][2]
			}
		}
	});
	player = connection.playStream(yt(voiceq[msg.guild.id].songs[0][0], { audioonly: true }));
	player.setBitrate(96000);
	player.on("end", () => {
		voiceq[msg.guild.id].songs.shift();
		if (!voiceq[msg.guild.id].songs.length < 1) {
			next(msg, cmd, args, connection);
			return;
		}
		voiceq[msg.guild.id].playing = 0;
	});
}

function formatPlaylistId(input) {
	var index = input.indexOf("?list=") != -1 ? input.indexOf("?list=") : -1;
	var output;
	//if (index == -1) index = input.indexOf("&list=");
	if (index != -1) {
		output = input.substring(index + 6);
		if (output.indexOf("&") != -1) {
			output = input.substring(0, input.indexOf("&"));
		}
		return output;
	}
	else {
		return -1;
	}
}

function formatVideoId(input) {
	var index = input.indexOf("?v=") != -1 ? input.indexOf("?v=") : -1;
	var output;
	if (index != -1) {
		output = input.substring(index + 3);
		if (output.indexOf("&") != -1) {
			output = input.substring(0, input.indexOf("&"));
		}
		return output;
	}
	else {
		return -1;
	}
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}