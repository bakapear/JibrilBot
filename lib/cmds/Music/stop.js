module.exports = {
    name: ["stop", "s"],
    desc: "Clears queue and leaves voicechannel.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 6)) return
        voice[msg.guild.id].chan.leave()
        for (let prop in voice[msg.guild.id]) voice[msg.guild.id][prop] = null
        return
    }
}