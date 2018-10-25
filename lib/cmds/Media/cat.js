let got = require("got")

module.exports = {
    name: ["cat"],
    desc: "Displays a random cute cat picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let url = "http://aws.random.cat/meow.php"
        let body = (await got(url, { json: true })).body
        msg.channel.send({ embed: { image: { url: body.file } } })
    }
}