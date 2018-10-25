let got = require("got")
let api_soundcloud = process.env.API_SOUNDCLOUD

module.exports = {
    name: ["soundcloud", "sc", "fsoundcloud", "fsc"],
    desc: "Plays a track from soundcloud.",
    permission: "",
    usage: "<query>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 3)) return
        if (!voice[msg.guild.id].chan) {
            voice[msg.guild.id].chan = msg.member.voiceChannel
            voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
        }
        let mod = msg.content.startsWith(".") ? true : false
        let song = await getSoundCloudSong(args.join(" "), mod)
        if (!song) {
            msg.channel.send("Nothing found!")
            return
        }
        if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
            let last = 1
            if (cmd === "fsoundcloud" || cmd === "fsc") voice[msg.guild.id].queue.splice(1, 0, song)
            else {
                voice[msg.guild.id].queue.push(song)
                last = voice[msg.guild.id].queue.length - 1
            }
            showPlayMessage(msg, "Added to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
        }
        else {
            voice[msg.guild.id].queue = []
            voice[msg.guild.id].queue.push(song)
            voice[msg.guild.id].msg = msg
            playQueue(msg)
        }
    }
}

async function getSoundCloudSong(query, rnd) {
    let url = "https://api-v2.soundcloud.com/search/tracks"
    let body = (await got(url, {
        query: {
            q: query,
            client_id: api_soundcloud
        },
        json: true
    })).body
    if (!body.collection.length) return
    let mod = rnd ? Math.floor(Math.random() * body.collection.length) : 0
    let trackurl = "https://api.soundcloud.com/i1/tracks/" + body.collection[mod].uri.substr(34) + "/streams"
    let song = (await got(trackurl, {
        query: {
            client_id: api_soundcloud
        },
        json: true
    })).body
    return {
        type: "soundcloud",
        link: song.http_mp3_128_url,
        name: body.collection[mod].title,
        img: body.collection[mod].artwork_url || body.collection[mod].user.avatar_url
    }
}