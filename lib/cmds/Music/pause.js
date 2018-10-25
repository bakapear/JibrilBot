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
            msg.channel.send("Queue resumed!")
        }
        else {
            voice[msg.guild.id].disp.pause()
            voice[msg.guild.id].paused = true
            msg.channel.send("Queue paused!")
        }
    }
}