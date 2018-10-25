let got = require("got")

module.exports = {
    name: ["define", "def"],
    desc: "Gets the definition of a word.",
    permission: "",
    usage: "<word>",
    args: 1,
    command: async function (msg, cmd, args) {
        let url = "https://api.datamuse.com/words?md=d&v=enwiki&sp=" + encodeURIComponent(msg.content.slice(cmd.length + 1).trim())
        let body = (await got(url, { json: true })).body
        if (!body || body.length < 1) {
            msg.channel.send("Nothing found!")
            return
        }
        else if (!body[0].defs) {
            msg.channel.send("No definition for that!")
            return
        }
        let mod = msg.content.startsWith(".") ? Math.floor(Math.random() * body[0].defs.length) : 0
        let def = body[0].defs[mod].split("\t")
        msg.channel.send("**" + body[0].word + "**: \"" + def[1] + "\"")
    }
}
