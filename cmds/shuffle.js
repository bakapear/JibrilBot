module.exports = {
    name: ["shuffle"],
    desc: "Shuffles the entire queue.",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id) || !voiceq[msg.guild.id].songs.length) { msg.channel.send("No songs in queue!"); return; }
        shuffleArray(voiceq[msg.guild.id].songs);
        msg.channel.send("Shuffled the song queue!");
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}