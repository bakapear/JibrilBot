let got = require("got")
let ytdl = require("ytdl-core")
let api_google = process.env.API_GOOGLE

module.exports = {
    name: ["youtube", "yt", "playlist", "ytpl"],
    desc: "Gets the first 5 results from query",
    permission: "",
    usage: "<query>",
    args: 1,
    command: async function (msg, cmd, args) {
        let type = "video"
        if (cmd === "playlist" || cmd === "ytpl") type = "playlist"
        let items = await getItems(type, args.join(" "))
        if (!items) {
            msg.channel.send("Nothing found!")
            return
        }
        let message = []
        for (let i = 0; i < items.length; i++) {
            message.push(`${i + 1}. [${items[i].name}](${items[i].url}) [${items[i].size}]`)
        }
        msg.channel.send({
            embed: {
                color: 14506163,
                title: "Search Results",
                description: message.join("\n")
            }
        })
    }
}

async function getItems(type, query) {
    let url = "https://www.googleapis.com/youtube/v3/search"
    let body = (await got(url, {
        query: {
            q: query,
            part: "snippet",
            type: type,
            key: api_google
        },
        json: true
    })).body
    if (!body.items.length) return
    let items = []
    for (let i = 0; i < body.items.length; i++) {
        let link = "https://www.youtube.com/"
        let size = 0
        if (body.items[i].id.videoId) {
            link += "watch?v=" + body.items[i].id.videoId
            let seconds = (await ytdl.getInfo(body.items[i].id.videoId)).length_seconds
            size = timeFromSeconds(seconds)
        }
        if (body.items[i].id.playlistId) {
            link += "playlist?list=" + body.items[i].id.playlistId
            size = await getPlaylistLength(body.items[i].id.playlistId) + " Videos"
        }
        items.push({
            url: link,
            name: body.items[i].snippet.title,
            size: size
        })
    }
    return items
}

async function getPlaylistLength(id) {
    let url = "https://www.googleapis.com/youtube/v3/playlistItems"
    let body = (await got(url, {
        query: {
            playlistId: id,
            part: "id",
            key: api_google
        },
        json: true
    })).body
    return body.pageInfo.totalResults
}

function timeFromSeconds(seconds) {
    let date = new Date(null)
    date.setSeconds(seconds)
    date = date.toISOString().substr(11, 8)
    if (date.split(":")[0] === "00") date = date.substr(3)
    return date
}