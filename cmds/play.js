const core = require("../core.js");
const bot = core.bot;
let voiceq = core.voiceq;
const yt = require("ytdl-core");
const request = require("request");
const api_google = process.env.API_GOOGLE;
let player;

module.exports = {
	name: ["play", "p"],
	desc: "Plays a youtube video in the voicechannel.",
	permission: "",
	usage: "<query>",
	args: 1,
	command: function (msg, cmd, args) {
		if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
		if (!msg.member.voiceChannel) {
			msg.channel.send("You're not in a voice channel!");
			return
		}
		if (voiceq[msg.guild.id].playing >= 1 && voiceq[msg.guild.id].playing != 1) {
			msg.channel.send("Something is already playing!");
			return;
		}
		request({
			url: `https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
			qs: {
				key: api_google
			},
			json: true
		}, function (error, response, body) {
			if (body.items.length < 1) {
				msg.channel.send("Nothing found!");
			}
			else {
				let mod = 0;
				if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.items.length);
				let videoid = body.items[mod].id.videoId;
				request({
					url: `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoid}`,
					qs: {
						key: api_google
					},
					json: true
				}, function (error, response, body) {
					voiceq[msg.guild.id].songs.push([videoid, body.items[0].snippet.title, body.items[0].snippet.thumbnails.medium.url]);
					if (voiceq[msg.guild.id].playing == 0) {
						msg.member.voiceChannel.join().then(connection => {
							voiceq[msg.guild.id].playing = 1;
							msg.channel.send({
								embed: {
									color: 14506163,
									title: "Now Playing",
									description: `\`${voiceq[msg.guild.id].songs[0][1]}\``,
									image: {
										url: voiceq[msg.guild.id].songs[0][2]
									}
								}
							}).then(m => {
								player = connection.playStream(yt(voiceq[msg.guild.id].songs[0][0], { audioonly: true }));
								player.setBitrate(96000);
								player.on("end", () => {
									voiceq[msg.guild.id].songs.shift();
									if (!voiceq[msg.guild.id].songs.length < 1) {
										next(msg, cmd, args, connection, player);
										return;
									}
									voiceq[msg.guild.id].playing = 0;
									msg.member.voiceChannel.leave();
								});
							});
						});
					}
					else {
						msg.channel.send({
							embed: {
								color: 14506163,
								title: "Added to Queue",
								description: `\`${body.items[0].snippet.title}\``,
								thumbnail: {
									url: body.items[0].snippet.thumbnails.default.url
								}
							}
						});
					}
				});

			}
		});
	},
	end: function () {
		player.end();
	}
}

function next(msg, cmd, args, connection, player) {
	voiceq[msg.guild.id].playing = 1;
	msg.channel.send({
		embed: {
			color: 14506163,
			title: "Now Playing",
			description: `\`${voiceq[msg.guild.id].songs[0][1]}\``,
			image: {
				url: voiceq[msg.guild.id].songs[0][2]
			}
		}
	}).then(m => {
		player = connection.playStream(yt(voiceq[msg.guild.id].songs[0][0], { audioonly: true }));
		player.setBitrate(96000);
		player.on("end", () => {
			voiceq[msg.guild.id].songs.shift();
			if (!voiceq[msg.guild.id].songs.length < 1) {
				next(msg, cmd, args, connection, player);
				return;
			}
			voiceq[msg.guild.id].playing = 0;
			msg.member.voiceChannel.leave();
		});
	});
}