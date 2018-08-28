module.exports = {
    name: ["pause"],
    desc: "Toggle pause the current song",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 6)) return
        if (voice[msg.guild.id].paused) {
            voice[msg.guild.id].disp.resume()
            voice[msg.guild.id].paused = false
        }
        else {
            voice[msg.guild.id].disp.pause()
            voice[msg.guild.id].paused = true
        }
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