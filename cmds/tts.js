const tts = require('google-tts-api');
const core = require("../core.js");
const bot = core.bot;
let voiceq = core.voiceq;

module.exports = {
    name: ["tts"],
    desc: "Make the bot say something in Text-To-Speech!",
    permission: "",
    usage: "<message>",
    args: 1,
    command: function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) {
            msg.channel.send("You're not in a voice channel!");
            return
        }
        if (voiceq[msg.guild.id].playing >= 1 && voiceq[msg.guild.id].playing != 4) {
			msg.channel.send("Something is already playing!");
			return;
		}
        tts(args.join(" ").substring(0, 200), 'en', 1).then(function (url) {
            msg.member.voiceChannel.join().then(connection => {
                voiceq[msg.guild.id].playing = 4;
                let toast = connection.playStream(url);
                toast.setBitrate(96000);
                toast.on("error", console.error);
                toast.on("end", () => {
                    voiceq[msg.guild.id].playing = 0;
                });
            });
        });
    }
}