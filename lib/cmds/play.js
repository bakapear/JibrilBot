let ytdl = require("ytdl-core")
let got = require("got")
let api_google = process.env.API_GOOGLE

module.exports = {
    name: ["play", "fplay", "pp", "fp", "playshuffle", "ps"],
    desc: "Streams audio from a youtube video or playlist into the voicechannel.",
    permission: "",
    usage: "(channel) ; <query|url>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, args[1] === ";" ? 1 : 3)) return
        if (!voice[msg.guild.id].chan) {
            if (args[1] === ";") {
                let channel = msg.guild.channels.find(x => x.name === args[0] && x.type === "voice")
                if (!channel) {
                    msg.channel.send("Invalid channel!")
                    return
                }
                voice[msg.guild.id].chan = channel
                args.splice(0, 2)
            }
            else {
                voice[msg.guild.id].chan = msg.member.voiceChannel
            }
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
            if (cmd === "fplay" || cmd === "fp") voice[msg.guild.id].queue.splice(1, 0, songs)
            else {
                voice[msg.guild.id].queue.push(songs)
                last = voice[msg.guild.id].queue.length - 1
            }
            showPlayMessage(msg, "Added to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img, voice[msg.guild.id].queue[last].duration)
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
                if (cmd === "ps" || cmd === "playshuffle") songs = shuffleArray(songs)
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
    if (!query.q && !query.v && query.list) {
        let next = ""
        let songs = []
        let ids = []
        do {
            let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&pageToken=${next}&maxResults=50&playlistId=${query.list}&key=${api_google}`
            let body = (await got(url, { json: true })).body
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
                ids.push(body.items[i].snippet.resourceId.videoId)
            }
            next = body.nextPageToken
        } while (next)
        let times = await getDurations(ids)
        for (let i = 0; i < songs.length; i++) {
            songs[i].duration = times[i]
        }
        return songs
    }
    else {
        let time = query.t
        if (query.q) query = query.q
        if (query.v) query = query.v
        let url = "https://www.googleapis.com/youtube/v3/search"
        let body = (await got(url, {
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
            duration: await getDurations([body.items[mod].id.videoId]),
            time: time
        }
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

async function getDurations(ids) {
    let url = "https://www.googleapis.com/youtube/v3/videos"
    let times = []
    let long = 0
    do {
        let body = (await got(url, {
            query: {
                id: ids.splice(0, 50).join(","),
                part: "contentDetails",
                key: api_google,
                fields: "items/contentDetails/duration"
            },
            json: true
        })).body
        for (let i = 0; i < body.items.length; i++) {
            times.push(formatYTTime(body.items[i].contentDetails.duration))
        }
        long++
        if (long === 10) {
            msg.channel.send("Wow that's a large playlist! I'm working on it.")
        }
    } while (ids.length)
    return times
}

function formatYTTime(duration) {
    let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    match = match.slice(1).map(x => x ? x.replace(/\D/, '') : x)
    let hours = (parseInt(match[0]) || 0)
    let minutes = (parseInt(match[1]) || 0)
    let seconds = (parseInt(match[2]) || 0)
    let date = new Date(null)
    date.setSeconds(hours * 3600 + minutes * 60 + seconds)
    date = date.toISOString().substr(11, 8)
    if (date.split(":")[0] === "00") date = date.substr(3)
    return date
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}