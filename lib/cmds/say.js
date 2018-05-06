module.exports = {
    name: ["say"],
    desc: "Let the bot say something.",
    permission: "",
    usage: "<message>",
    args: 1,
    command: function (msg, cmd, args) {
        msg.channel.send(msg.content.slice(cmd.length + 1));
    }
}