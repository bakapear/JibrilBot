let yt = require("ytdl-core");
let dispatcher;

module.exports = {
    name: ["radio", "r"],
    desc: "Streams the listen.moe anime radio in the voicechannel.",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return; }
        if (voiceq[msg.guild.id].playing !== 0) { msg.channel.send("Something is already playing!"); return; }
        msg.member.voiceChannel.join().then(connection => {
            voiceq[msg.guild.id].playing = "radio";
            if (args[0] == "lofi") {
                msg.channel.send({
                    embed: {
                        color: 14506163,
                        title: "Radio",
                        description: `Joined ${connection.channel} streaming *lofi hip hop radio*!`
                    }
                });
                let stream = yt("https://www.youtube.com/watch?v=ohQPySWJToo");
                dispatcher = connection.playStream(stream);
                dispatcher.setBitrate(96000);
            }
            else {
                msg.channel.send({
                    embed: {
                        color: 14506163,
                        title: "Radio",
                        description: `Joined ${connection.channel} streaming *listen.moe*!`
                    }
                });
                dispatcher = connection.playArbitraryInput(`https://listen.moe/opus`);
                dispatcher.setBitrate(96000);
            }
        });
    }
}