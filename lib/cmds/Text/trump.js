let got = require("got")

module.exports = {
    name: ["trump"],
    desc: "Prints out a trump quote.",
    permission: "",
    usage: "(something)",
    args: 0,
    command: async function (msg, cmd, args) {
        let url = "https://api.whatdoestrumpthink.com/api/v1/quotes"
        let body = (await got(url, { json: true })).body
        if (args.length < 1) {
            msg.channel.send(body.messages.non_personalized[Math.floor(Math.random() * body.messages.non_personalized.length)])
        }
        else {
            msg.channel.send(`${msg.content.slice(cmd.length + 1)} ${body.messages.personalized[Math.floor(Math.random() * body.messages.personalized.length)]}`)
        }
    }
}