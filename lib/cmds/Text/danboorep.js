let got = require("got")

module.exports = {
    name: ["danboorep", "boorep"],
    desc: "otaku weeb normie command but the comment version",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let body = await getComment(msg.content.startsWith("."))
        if (body.error) {
            msg.channel.send(body.error)
            return
        }
        if (!body.length) {
            msg.channel.send("Nothing found!")
        }
        msg.channel.send(body[0].body)
    }
}

async function getComment(rnd) {
    let url = "https://danbooru.donmai.us/comments.json"
    let body = (await got(url, {
        query: {
            page: rnd ? Math.floor(Math.random() * 1000) + 1 : 0,
            group_by: "comment"
        },
        json: true
    })).body
    if (body.success === false) {
        return { error: body.message }
    }
    return body
}