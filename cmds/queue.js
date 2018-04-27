module.exports = {
    name: ["q", "queue"],
    desc: "Shows the entire queue or if a number is given, the song at that position.",
    permission: "",
    usage: "(position) (rem)",
    args: 0,
    command: function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id) || !voiceq[msg.guild.id].songs.length) { msg.channel.send("No songs in queue!"); return; }
        let songnames = [];
        if (args == "") {
            let len = voiceq[msg.guild.id].songs.length > 15 ? 15 : voiceq[msg.guild.id].songs.length;
            for (i = 0; i < len; i++) {
                let song = voiceq[msg.guild.id].songs[i][1];
                let num = i + ".";
                if (num == 0) num = "NP:"
                songnames.push(`${num} \`${song}\`\n`);
            }
            if (voiceq[msg.guild.id].songs.length > 15) songnames.push(`...`);
        }
        else {
            if (isNaN(args[0])) { msg.channel.send("Please enter a number!"); return; }
            if (parseInt(args[0]) < 0 || parseInt(args[0]) > voiceq[msg.guild.id].songs.length - 1) { msg.channel.send("Invalid position!"); return; }
            if (args[1] == "rem") {
                if (args[0] == "0") { msg.channel.send("You cant delete the first song!"); return; }
                msg.channel.send(`Removed \`${voiceq[msg.guild.id].songs[args[0]][1]}\``);
                voiceq[msg.guild.id].songs.splice(args[0], 1);
                return;
            }
            let num = args[0] == "0" ? "NP:" : args[0] + ".";
            songnames.push(`${num} \`${voiceq[msg.guild.id].songs[args[0]][1]}\`\n`);
        }
        msg.channel.send({
            embed: {
                color: 14506163,
                title: "Play Queue - " + voiceq[msg.guild.id].songs.length + " Items",
                description: songnames.join("").substring(0, 2045)
            }
        });
    }
}