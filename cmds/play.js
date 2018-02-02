const yt = require("ytdl-core");
const request = require("request");
const api_google = process.env.API_GOOGLE;

module.exports = {
    name: ["play","p"],
    desc: "Plays a youtube video in the voicechannel.",
    permission: "",
    usage: "<query>",
    args: 1,
    command: function (boot, msg, cmd, args, bot) {
        if (!msg.member.voiceChannel) {
			msg.channel.send("You're not in a voice channel!");
			return
		}
		if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
			request({
				url: `https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
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
						msg.member.voiceChannel.join().then(connection => {
							msg.channel.send({
								embed: {
									color: 14506163,
									title: "Now Playing",
									description: `\`${body.items[0].snippet.title}\``,
									image: {
										url: body.items[0].snippet.thumbnails.medium.url
									}
								}
							}).then(m => {
								let player;
								player = connection.playStream(yt(videoid, { audioonly: true }));
								player.setBitrate(96000);
								player.on("end", () => {
									msg.member.voiceChannel.leave();
								});
							})
						})
					})

				}
			})
		}
		else {
			msg.channel.send(`Something is already playing!`);
		}
    }
}