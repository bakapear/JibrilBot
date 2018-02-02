module.exports = {
    name: ["pong"],
    desc: "The good old' pong command!",
    permission: "",
    usage: "",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        msg.channel.send("Ping!");
    }
}