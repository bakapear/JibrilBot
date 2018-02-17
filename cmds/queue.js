module.exports = {
    name: ["q", "queue"],
    desc: "Shows the entire queue or if a number is given, the song at that position.",
    permission: "",
    usage: "(position)",
    args: 0,
    command: function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) { msg.channel.send("No songs in queue!"); return; }
        if (voiceq[msg.guild.id].songs.length < 1) { msg.channel.send("No songs in queue!"); return; }
        let songnames = [];
        if (args == "") {
            for (i = 0; i < voiceq[msg.guild.id].songs.length; i++) {
                let song = voiceq[msg.guild.id].songs[i][1];
                if (song.length > 50) song = song.substring(0, 50) + "...";
                let num = i + ".";
                if (num == 0) num = "NP:"
                songnames.push(`${num} \`${song}\`\n`);
            }
        }
        else {
            if (isNaN(args[0])) { msg.channel.send("Please enter a number!"); return; }
            let num = args[0] + ".";
            if (num == 0) num = "NP:"
            songnames.push(`${num} \`${voiceq[msg.guild.id].songs[args[0]][1]}\`\n`);
        }
        msg.channel.send({
            embed: {
                color: 14506163,
                title: "Play Queue",
                description: songnames.join("").substring(0, 2045)
            }
        });
    }
}