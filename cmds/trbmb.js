const got = require("got");

module.exports = {
    name: ["trbmb"],
    desc: "That really helps my command!",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const res = await got("http://api.chew.pro/trbmb", { json: true });
        msg.channel.send(res.body[0]);
    }
}