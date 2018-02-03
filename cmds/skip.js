const core = require("../core.js");
const bot = core.bot;
let voiceq = core.voiceq;
const play = require("./play.js");

module.exports = {
    name: ["skip"],
    desc: "Skips current song.",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        if (!msg.member.voiceChannel) {
			msg.channel.send("You're not in a voice channel!");
			return
        }
        if (voiceq.hasOwnProperty(msg.guild.id)) {
		if (voiceq[msg.guild.id].playing == false) {
			msg.channel.send("I'm not in a voice channel!");
			return
        }
        play.end();
        }
    }
}