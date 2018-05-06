module.exports = {
    name: ["np", "nowplaying"],
    desc: "Shows the current song playing in queue.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) { msg.channel.send("No songs in queue!"); return; }
        if (!voiceq[msg.guild.id].songs.length) { msg.channel.send("No songs in queue!"); return; }
        msg.channel.send({
            embed: {
                color: 14506163,
                title: "Now Playing",
                url: `https://youtube.com/watch?v=${voiceq[msg.guild.id].songs[0][0]}`,
                description: `\`${voiceq[msg.guild.id].songs[0][1]}\``,
                image: {
                    url: voiceq[msg.guild.id].songs[0][2]
                }
            }
        });
    }
}