

module.exports = {
    name: ["a"],
    desc: "Does some test stuff",
    permission: "ADMINISTRATOR",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        msg.channel.send(eval(msg.content.slice(cmd.length + 1)));
    }
}