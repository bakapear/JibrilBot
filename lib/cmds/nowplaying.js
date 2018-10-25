let WebSocket = require("ws")

module.exports = {
    name: ["np", "nowplaying"],
    desc: "Shows the current song playing in queue.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!voice[msg.guild.id].queue || !voice[msg.guild.id].queue.length) {
            msg.channel.send("No items in queue!")
            return
        }
        let title = "Now Playing (" + miliToTime(voice[msg.guild.id].disp.time) + " - " + (voice[msg.guild.id].queue[0].duration || "Unknown") + ")"
        if (voice[msg.guild.id].queue[0].type === "radio") {
            let kpop = false
            let url = "wss://listen.moe/gateway"
            if (voice[msg.guild.id].queue[0].name.indexOf("kpop") >= 0) kpop = true
            if (kpop) url = "wss://listen.moe/kpop/gateway"
            let ws = new WebSocket(url)
            ws.on('open', () => ws.send(JSON.stringify({ op: 2 })))
            ws.on('message', (data) => {
                data = JSON.parse(data)
                let img = voice[msg.guild.id].queue[0].img
                if (data.d.song.artists[0].image) img = "https://cdn.listen.moe/artists/" + data.d.song.artists[0].image
                msg.channel.send({
                    embed: {
                        color: 14506163,
                        title: "Now Streaming listen.moe " + (kpop ? "KPOP" : "JPOP"),
                        description: (data.d.song.artists.map(x => x.name).join(", ")) + " - " + data.d.song.title,
                        url: "https://listen.moe/",
                        image: {
                            url: img
                        }
                    }
                })
                ws.close()
            })
        }
        else {
            msg.channel.send({
                embed: {
                    color: 14506163,
                    title: title,
                    description: voice[msg.guild.id].queue[0].name,
                    url: voice[msg.guild.id].queue[0].link,
                    image: {
                        url: voice[msg.guild.id].queue[0].img
                    }
                }
            })
        }
    }
}

function miliToTime(s) {
    let date = new Date(null)
    date.setMilliseconds(s)
    date = date.toISOString().substr(11, 8)
    if (date.split(":")[0] === "00") date = date.substr(3)
    return date
}