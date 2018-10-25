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