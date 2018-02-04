const core = require("../core.js");
let voiceq = core.voiceq;

module.exports = {
    name: ["q", "queue"],
    desc: "Shows the entire queue.",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        if (voiceq.hasOwnProperty(msg.guild.id)) {
            if (voiceq[msg.guild.id].songs.length < 1) {
                msg.channel.send("No songs in queue!");
                return;
            }
            let songnames = [];
            for (i = 0; i < voiceq[msg.guild.id].songs.length; i++) {
                let song = voiceq[msg.guild.id].songs[i][1];
                if (song.length > 50) {
                    song = song.substring(0, 50) + "...";
                }
                let num = i + ".";
                if (num == 0) num = "NP:"
                songnames.push(`${num} \`${song}\`\n`);
            }
            msg.channel.send({
                embed: {
                    color: 14506163,
                    title: "Play Queue",
                    description: songnames.join("")
                }
            });
        }
        else {
            msg.channel.send("No songs in queue!");
        }
    }
}