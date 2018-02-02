module.exports = {
    name: ["test"],
    desc: "Does some test stuff",
    permission: "",
    usage: "",
    args: 0,
    command: function (boot, msg, cmd, args) {
        msg.channel.send({
            embed: {
                description: args[0]
            }
        });
    }
}