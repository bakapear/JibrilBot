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
        msg.channel.send({
            embed: {
                color: 14506163,
                title: "Now Playing",
                description: voice[msg.guild.id].queue[0].name,
                url: voice[msg.guild.id].queue[0].link,
                image: {
                    url: voice[msg.guild.id].queue[0].img
                }
            }
        })
    }
}