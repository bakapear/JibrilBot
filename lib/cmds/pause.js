let play = require("./play.js");
module.exports = {
    name: ["skip"],
    desc: "Skips current song.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return; }
        if (!bot.voiceConnections.get(msg.channel.guild.id)) { msg.channel.send("I'm not in a voice channel!"); return; }
        let paused = play.pause();
        if (paused) {
            msg.channel.send("Queue paused!");
        } else {
            msg.channel.send("Queue unpaused!");
        }
    }
}