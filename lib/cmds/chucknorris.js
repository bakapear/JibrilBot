let got = require("got")

module.exports = {
    name: ["chuck", "norris", "chucknorris"],
    desc: "Prints out a chuck norris joke.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let url = "https://api.chucknorris.io/jokes/random"
        let body = (await got(url, { json: true })).body
        msg.channel.send(body.value)
    }
}