module.exports = {
    name: ["ping"],
    desc: "The good old' ping command!",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        const date = Date.now();
        msg.channel.send("Pinging...").then(m => {
            m.edit(`Pong! It took me **${Date.now() - date}ms**!`);
        });
    }
}