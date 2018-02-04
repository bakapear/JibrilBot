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
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) {
            msg.channel.send("You're not in a voice channel!");
            return
        }
        if (voiceq[msg.guild.id].playing == 0) {
            msg.channel.send("Nothing is playing right now.");
            return
        }
        if (voiceq[msg.guild.id].songs.length < 1) {
            voiceq[msg.guild.id].songs = [];
            voiceq[msg.guild.id].playing = 0;
            msg.member.voiceChannel.leave();
            return;
        }
        play.end();
    }
}