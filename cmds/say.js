module.exports = {
    name: ["say"],
    desc: "Let the bot say something.",
    permission: "",
    usage: "<message>",
    needargs: true,
    command: function (boot, msg, cmd, args) {
        msg.channel.send(msg.content.slice(cmd.length + 1));
    }
}