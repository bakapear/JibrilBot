module.exports = {
    name: ["ping"],
    desc: "The good old' ping command!",
    permission: "",
    usage: "",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        const date = Date.now();
        msg.channel.send("Pinging...").then(m => {
            m.edit(`Pong! It took me **${Date.now() - date}ms**!`);
        });
    }
}