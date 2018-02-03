const core = require("../core.js");
let voiceq = core.voiceq;

module.exports = {
    name: ["list"],
    desc: "Shows the entire queue.",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        if(voiceq.hasOwnProperty(msg.guild.id)) {
            if(voiceq[msg.guild.id].songs.length < 1) {
                msg.channel.send("No songs in queue!");
                return;
            }
            for(i = 0; i < voiceq[msg.guild.id].songs.length; i++) {
                msg.channel.send(`\`${voiceq[msg.guild.id].songs[i][1]}\``);
            }
        }
        else {
            msg.channel.send("No songs in queue!");
        }
    }
}