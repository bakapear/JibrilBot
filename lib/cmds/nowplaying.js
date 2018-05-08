let ytdl = require("ytdl-core");
let ytinfo = require("youtube-info");
let moment = require("moment");
let play = require("./play");
module.exports = {
    name: ["np", "nowplaying"],
    desc: "Shows the current song playing in queue.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) { msg.channel.send("No songs in queue!"); return; }
        if (!voiceq[msg.guild.id].songs.length) { msg.channel.send("No songs in queue!"); return; }
        let currentId = voiceq[msg.guild.id].songs[0][0];
        let info = await ytinfo(currentId);
        let current = moment.utc(play.time()).format('HH:mm:ss').split(":");
        if (current[0] == "00") current.shift();
        if (current[0].startsWith("0")) current[0] = current[0].substr(1);
        let total = moment.utc(info.duration * 1000).format('HH:mm:ss').split(":");
        if (total[0] == "00") total.shift();
        if (total[0].startsWith("0")) total[0] = total[0].substr(1);
        if (cmd == "new") current = ["00", "00"];
        msg.channel.send({
            embed: {
                color: 14506163,
                title: "Now Playing",
                url: `https://youtube.com/watch?v=${currentId}`,
                description: `\`${voiceq[msg.guild.id].songs[0][1]}\`\n\n\`${current.join(":")} - ${total.join(":")}\``,
                image: {
                    url: voiceq[msg.guild.id].songs[0][2]
                }
            }
        });
    }
}