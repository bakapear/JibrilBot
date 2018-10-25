let got = require("got")

module.exports = {
    name: ["trbmb"],
    desc: "That really helps my command!",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let url = "http://api.chew.pro/trbmb"
        let body = (await got(url, { json: true })).body
        msg.channel.send(body[0])
    }
}