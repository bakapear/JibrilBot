let got = require("got")

module.exports = {
    name: ["math", "m"],
    desc: "Gives you the ability to do math stuff!",
    permission: "",
    usage: "<math stuff>",
    args: 1,
    command: async function (msg, cmd, args) {
        let url = `http://api.mathjs.org/v4/?expr=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`
        let body = (await got(url, { json: true })).body
        msg.channel.send(body)
    }
}