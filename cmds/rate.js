module.exports = {
    name: ["rate"],
    desc: "Rates something.",
    permission: "",
    usage: "(something)",
    args: 0,
    command: function (boot, msg, cmd, args) {
        const rnd = Math.floor(Math.random() * 11);
        msg.channel.send(`Rated **${rnd}/10**!`);
    }
}