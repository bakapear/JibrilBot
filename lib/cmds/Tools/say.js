module.exports = {
    name: ["say", "sayb"],
    desc: "Let the bot say something.",
    permission: "",
    usage: "<message>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (cmd === "sayb") msg.channel.send({ embed: { color: 3553599, description: msg.content.slice(cmd.length + 1) } })
        else msg.channel.send(msg.content.slice(cmd.length + 1))
    }
}