let dispatcher;

module.exports = {
    name: ["file"],
    desc: "Play the audio from url",
    permission: "",
    usage: "<url>",
    args: 1,
    command: async function (msg, cmd, args, index) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return }
        if (voiceq[msg.guild.id].playing !== 0) { msg.channel.send("Something is already playing!"); return; }
        voiceq[msg.guild.id].playing = "file";
        msg.member.voiceChannel.join().then(connection => {
            printFile(msg, args[0], index);
            playFile(msg, connection, args[0]);
        });
    }
}

function playFile(msg, connection, streamurl) {
    dispatcher = connection.playArbitraryInput(streamurl);
    dispatcher.setBitrate(96000);
    dispatcher.on("end", () => {
        voiceq[msg.guild.id].playing = 0;
    });
    dispatcher.on("error", err => {
        console.log(err);
    });
}

function printFile(msg, link, index) {
    if (index != undefined) {
        msg.channel.send({
            embed: {
                color: 4212432,
                title: "Playing Custom",
                url: link,
                description: "\`" + index + " @ " + link + "\`"
            }
        });
        return;
    }
    msg.channel.send({
        embed: {
            color: 14506163,
            title: "Playing File",
            url: link,
            description: "\`" + link + "\`"
        }
    });
}
