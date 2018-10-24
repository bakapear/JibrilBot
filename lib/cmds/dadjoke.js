let got = require("got")

module.exports = {
    name: ["dad", "dadjoke"],
    desc: "Prints out a terrible dad joke.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let url = "https://icanhazdadjoke.com/"
        let body = (await got(url, { json: true })).body
        msg.channel.send(body.joke)
    }
}