let got = require("got")

module.exports = {
    name: ["nyan", "lick", "cuddle", "smug", "hug", "cute", "kiss", "chu", "pat", "pout", "cry", "stare", "slap", "weird", "tickle", "lewd", "owo", "nom", "clap", "potato"],
    desc: `Displays a random gif of the given type.`,
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let url = "https://rra.ram.moe/i/r?type=" + cmd
        let body = (await got(url, { json: true })).body
        let img = "https://rra.ram.moe" + body.path
        msg.channel.send({ embed: { image: { url: img } } })
    }
}