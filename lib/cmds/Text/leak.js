module.exports = {
    name: ["leak"],
    desc: "Leak information.",
    permission: "",
    usage: "<message>",
    args: 1,
    command: async function (msg, cmd, args) {
        msg.channel.send(msg.content.slice(cmd.length + 1).toUpperCase())
    }
}