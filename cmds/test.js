const core = require("../core.js");

module.exports = {
    name: ["a"],
    desc: "Does some test stuff",
    permission: "ADMINISTRATOR",
    usage: "",
    args: 1,
    command: function (msg, cmd, args) {
        if(msg.author.id == 309727983936208906) {
            msg.channel.send(eval(msg.content.slice(cmd.length + 1)));
        }
        else {
            msg.channel.send("whatareyoudoingOwO!");
        }
    }
}