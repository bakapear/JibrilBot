module.exports = {
    name: ["repeat"],
    desc: "Put the queue on repeat.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 6)) return
        if (voice[msg.guild.id].repeat) {
            voice[msg.guild.id].repeat = false
            msg.channel.send("Queue repeat is now off!")
        }
        else {
            voice[msg.guild.id].repeat = true
            msg.channel.send("Queue repeat is now on!")
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