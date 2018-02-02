module.exports = {
    name: ["rate"],
    desc: "Rates something.",
    permission: "",
    usage: "(something)",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        const rnd = Math.floor(Math.random() * 11);
        msg.channel.send(`Rated **${rnd}/10**!`);
    }
}