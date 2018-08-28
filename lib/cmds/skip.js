module.exports = {
    name: ["skip"],
    desc: "Skips current song.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 6)) return
        voice[msg.guild.id].disp.end()
    }
}

let checks = [
    msg => { //1
        if (!msg.content.split(" ").slice(1).length) {
            msg.channel.send("Invalid arguments!")
            return true
        }
    },
    msg => { //2
        if (!msg.member.voiceChannel) {
            msg.channel.send("You're not in a voice channel!")
            return true
        }
    },
    msg => { //4
        if (!voice[msg.guild.id].chan) {
            msg.channel.send("I'm not in a voice channel!")
            return true
        }
    }
]