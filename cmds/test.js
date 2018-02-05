const fs = require('fs');

module.exports = {
    name: ["tea"],
    desc: "Does some test stuff",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        msg.member.voiceChannel.join().then(connection => {
            msg.reply("Ready!");
            const receiver = connection.createReceiver();
            let stream;
            connection.on("speaking", (user, speaking) => {
                if(speaking) {
                    msg.channel.send(`${user} speaking!`);
                    stream = receiver.createOpusStream(user);
                }
                else {
                    msg.channel.send(`${user} no longer speaking!`);
                    if(stream != undefined) {
                        let player = connection.playOpusStream(stream);
                        player.setBitrate(96000);
                        player.on("end", () => {
							msg.channel.send("STOP!");
						});
						player.on("error", e => {
							console.log(e);
						});
                    }
                }
            });
        });
    }
}