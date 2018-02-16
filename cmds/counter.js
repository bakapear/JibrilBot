const core = require("../core.js");
const boot = core.boot;
let timer = {};

module.exports = {
    name: ["counter"],
    desc: "Starts counting up.",
    permission: "",
    usage: "(reset)",
    args: 0,
    command: function (msg, cmd, args) {
        if (!timer.hasOwnProperty(msg.author.id)) timer[msg.author.id] = 0;
        if (args == "") {
            if (timer[msg.author.id] == 0) {
                timer[msg.author.id] = Date.now();
                msg.channel.send(`Counter started!`);
            }
            else {
                const elapsed = new Date(Date.now() - timer[msg.author.id]);
                msg.channel.send(`${elapsed.getSeconds()} and counting...`);
            }
        }
        if (args[0] == "reset") {
            if (timer[msg.author.id] == 0) msg.channel.send("No counter is running!");
            else { timer[msg.author.id] = 0; msg.channel.send("Counter has been reset!"); }
        }
    }
}