let fruit = require("../utils/fruit");

module.exports = {
    name: ["shuffle"],
    desc: "Shuffles the entire queue.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id) || !voiceq[msg.guild.id].songs.length) { msg.channel.send("No songs in queue!"); return; }
        if (voiceq[msg.guild.id].songs.length > 1) {
            var currentsong = voiceq[msg.guild.id].songs.shift();
            voiceq[msg.guild.id].songs.shuffle();
            voiceq[msg.guild.id].songs.unshift(currentsong);
        }
        msg.channel.send("Shuffled the song queue!");
    }
}