const core = require("../core.js");
const bot = core.bot;
const request = require("request");

module.exports = {
	name: ["radio", "r"],
	desc: "Streams the listen.moe anime radio in the voicechannel.",
	permission: "",
	usage: "",
	args: 0,
	command: function (msg, cmd, args) {
		if (!msg.member.voiceChannel) {
			msg.channel.send("You're not in a voice channel!");
			return
		}
		if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
			msg.member.voiceChannel.join().then(connection => {
				msg.channel.send({
					embed: {
						color: 14506163,
						title: "Radio",
						description: `Joined ${connection.channel} streaming *listen.moe*!`
					}
				})
				let radio;
				radio = connection.playArbitraryInput(`https://listen.moe/opus`);
				radio.setBitrate(96000);
			})
		}
		else {
			msg.channel.send({
				embed: {
					color: 14506163,
					title: "Radio",
					description: `Stopped streaming radio.`
				}
			})
			msg.member.voiceChannel.leave();
		}
	}
}