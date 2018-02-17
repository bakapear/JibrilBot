module.exports = {
    name: ["stop", "s"],
    desc: "Clears queue and stops voicechatting.",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return; }
        if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) { msg.channel.send("I'm not in a voice channel!"); return; }
        voiceq[msg.guild.id].songs = [];
        voiceq[msg.guild.id].playing = 0;
        msg.member.voiceChannel.leave();
    }
}