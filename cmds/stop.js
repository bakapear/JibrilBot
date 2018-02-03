const core = require("../core.js");
const bot = core.bot;
let voiceq = core.voiceq;

module.exports = {
    name: ["stop", "s"],
    desc: "Clears queue and stops voicechatting.",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        if (!msg.member.voiceChannel) {
            msg.channel.send("You're not in a voice channel!");
            return
        }
        if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
            msg.channel.send("I'm not in a voice channel!");
            return
        }
        if (voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id].songs = []; voiceq[msg.guild.id].playing = false;
        msg.member.voiceChannel.leave();
    }
}