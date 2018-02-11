const core = require("../core.js");
const bot = core.bot;
let voiceq = core.voiceq;
const request = require("request");

module.exports = {
	name: ["radio", "r"],
	desc: "Streams the listen.moe anime radio in the voicechannel.",
	permission: "",
	usage: "",
	args: 0,
	command: function (msg, cmd, args) {
		if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
		if (!msg.member.voiceChannel) {
			msg.channel.send("You're not in a voice channel!");
			return;
		}
		if (voiceq[msg.guild.id].playing >= 1 && voiceq[msg.guild.id].playing != 2) {
			msg.channel.send("Something is already playing!");
			return;
		}
		if (voiceq[msg.guild.id].playing == 0) {
			msg.member.voiceChannel.join().then(connection => {
				voiceq[msg.guild.id].playing = 2;
				msg.channel.send({
					embed: {
						color: 14506163,
						title: "Radio",
						description: `Joined ${connection.channel} streaming *listen.moe*!`
					}
				});
				let radio;
				radio = connection.playArbitraryInput(`https://listen.moe/opus`);
				radio.setBitrate(96000);
			});
		}
		else {
			msg.channel.send({
				embed: {
					color: 14506163,
					title: "Radio",
					description: `Stopped streaming radio.`
				}
			});
			voiceq[msg.guild.id].playing = 0;
			msg.member.voiceChannel.leave();
		}
	}
}