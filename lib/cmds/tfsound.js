let got = require("got")

module.exports = {
    name: ["tfsound", "tfsnd", "ftfsnd", "ftfsound"],
    desc: "Plays a voice sound from TF2",
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
        let song = await getSound(args.join(" "), mod)
        if (!song) {
            msg.channel.send("Nothing found!")
            return
        }
        if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
            let last = 1
            if (cmd === "ftfsnd" || cmd === "ftfsound") voice[msg.guild.id].queue.splice(1, 0, song)
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

function searchSound(query, array) {
    query = query.trim().toLowerCase()
    let matched = []
    for (let i = 0; i < array.files.length; i++) {
        if (array.files[i].text.toLowerCase().match(query) || array.files[i].path.toLowerCase().match(query)) {
            matched.push(array.files[i].path)
        }
    }
    return matched
}

async function getSound(query, rnd) {
    let url = "https://raw.githubusercontent.com/bakapear/tfvoices/master/src/full.json"
    let body = (await got(url, { json: true })).body
    let matched = searchSound(query.trim(), body)
    if (!matched.length) return
    let mod = rnd ? Math.floor(Math.random() * matched.length) : 0
    return {
        type: "tfsnd",
        link: body.url + matched[mod],
        name: matched[mod]
    }
}