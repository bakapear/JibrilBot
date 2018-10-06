let ytdl = require("ytdl-core")
let got = require("got")
let api_google = process.env.API_GOOGLE

module.exports = {
    name: ["play", "fplay"],
    desc: "Streams audio from a youtube video or playlist into the voicechannel.",
    permission: "",
    usage: "<query|url>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 3)) return
        if (!voice[msg.guild.id].chan) {
            voice[msg.guild.id].chan = msg.member.voiceChannel
            voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
        }
        if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
            let mod = msg.content.startsWith(".") ? -1 : 0
            let songs = await getYoutubeVideo(args.join(" "), mod)
            if (!songs) {
                msg.channel.send("Nothing found!")
                return
            }
            if (songs.constructor === Array) {
                let last = voice[msg.guild.id].queue.length
                voice[msg.guild.id].queue.push(...songs)
                showPlayMessage(msg, "Added " + songs.length + " Items to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
                return
            }
            let last = 1
            if (cmd === "fplay") voice[msg.guild.id].queue.splice(1, 0, songs)
            else {
                voice[msg.guild.id].queue.push(songs)
                last = voice[msg.guild.id].queue.length - 1
            }
            showPlayMessage(msg, "Added to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
        }
        else {
            voice[msg.guild.id].queue = []
            let mod = msg.content.startsWith(".") ? -1 : 0
            let songs = await getYoutubeVideo(args.join(" "), mod)
            if (!songs) {
                msg.channel.send("Nothing found!")
                return
            }
            if (songs.constructor === Array) {
                let last = voice[msg.guild.id].queue.length
                voice[msg.guild.id].queue.push(...songs)
                showPlayMessage(msg, "Added " + songs.length + " Items to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
            }
            else {
                voice[msg.guild.id].queue.push(songs)
            }
            voice[msg.guild.id].msg = msg
            playQueue(msg)
        }
    }
}

async function getYoutubeVideo(query, start) {
    query = getQueryData(query)
    try {
        if (!query.q && !query.v && query.list) {
            let next = ""
            let songs = []
            do {
                let body = (await got(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&pageToken=${next}&maxResults=50&playlistId=${query.list}&key=${api_google}`, { json: true })).body
                if (!body.items.length) return
                for (let i = 0; i < body.items.length; i++) {
                    let thumb = "https://puu.sh/BdcCE.jpg"
                    if (body.items[i].snippet.thumbnails && body.items[i].snippet.thumbnails.high) {
                        thumb = body.items[i].snippet.thumbnails.high.url
                    }
                    songs.push({
                        type: "yt",
                        id: body.items[i].snippet.resourceId.videoId,
                        link: "https://youtube.com/watch?v=" + body.items[i].snippet.resourceId.videoId,
                        name: body.items[i].snippet.title,
                        desc: body.items[i].snippet.description,
                        img: thumb
                    })
                }
                next = body.nextPageToken
            } while (next)
            return songs
        }
        else {
            if (query.q) query = query.q
            if (query.v) query = query.v
            let body = (await got("https://www.googleapis.com/youtube/v3/search", {
                query: { part: "snippet", type: "video", maxResults: "50", q: query, key: api_google },
                json: true
            })).body
            let mod = start < 0 ? Math.floor(Math.random() * body.items.length) : start
            if (!body.items.length) return
            let thumb = "https://puu.sh/BdcCE.jpg"
            if (body.items[mod].snippet.thumbnails && body.items[mod].snippet.thumbnails.high) {
                thumb = body.items[mod].snippet.thumbnails.high.url
            }
            return {
                type: "yt",
                id: body.items[mod].id.videoId,
                link: "https://youtube.com/watch?v=" + body.items[mod].id.videoId,
                name: body.items[mod].snippet.title,
                desc: body.items[mod].snippet.description,
                img: thumb,
                time: query.t
            }
        }
    } catch (e) {
        console.log(e.response.body)
        return
    }
}

function getQueryData(input) {
    if (ytdl.validateURL(input) || input.indexOf("playlist?list=") >= 0) {
        let id = input.indexOf("youtu.be/") >= 0 ? input.substring(input.indexOf("youtu.be/") + 9, input.indexOf("?")) : null
        input = input.substring(input.indexOf("?") + 1)
        if (id) input += "&v=" + id
        return JSON.parse('{"' + decodeURI(input).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    }
    return { q: input }
}