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
        let title = "Now Playing (" + miliToTime(voice[msg.guild.id].disp.time) + " - " + voice[msg.guild.id].queue[0].duration + ")"
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

function miliToTime(s) {
    let date = new Date(null)
    date.setMilliseconds(s)
    date = date.toISOString().substr(11, 8)
    if (date.split(":")[0] === "00") date = date.substr(3)
    return date
}