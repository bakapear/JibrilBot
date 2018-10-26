let got = require("got")

module.exports = {
    name: ["safebooru", "booru"],
    desc: "otaku weeb normie command for special delivery inspired by special recipe",
    permission: "",
    usage: "(tags)",
    args: 0,
    command: async function (msg, cmd, args) {
        let query = args ? msg.content.slice(cmd.length + 1) : ""
        let body = await getPosts(query)
        if (!body || !body.length) {
            msg.channel.send("Nothing found!")
            return
        }
        let mod = msg.content.startsWith(".") ? Math.floor(Math.random() * body.length) : 0
        let img = "https://safebooru.org/images/" + body[mod].directory + "/" + body[mod].image
        msg.channel.send({ embed: { image: { url: img } } })
    }
}

async function getPosts(query) {
    let url = "http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=100&json=1&tags=" + encodeURIComponent(query.trim())
    let body = (await got(url, { json: true })).body
    return body
}