module.exports = {
    name: ["pong"],
    desc: "Replies with \"Ping!\"",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        msg.channel.send("Ping!");
    }
}