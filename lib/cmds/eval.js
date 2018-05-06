let got = require("got");
let moment = require("moment");

module.exports = {
    name: ["eval"],
    desc: "Evals javascript code",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (msg.author.id !== "309727983936208906") { msg.channel.send("You ain't pear!"); return; }
        try {
            var output = eval(msg.content.slice(cmd.length + 1));
        } catch (e) {
            msg.channel.send("```\n" + e + "\n```");
            return;
        }
        msg.channel.send("```js\n" + output + "\n```");
    }
}