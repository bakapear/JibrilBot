module.exports = {
    name: ["q", "queue", "qlr"],
    desc: "Shows the entire queue or if a number is given, the song at that position.",
    permission: "",
    usage: "(rem) (position)",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!voice[msg.guild.id].queue || !voice[msg.guild.id].queue.length) {
            msg.channel.send("No items in queue!")
            return
        }
        if (cmd === "qlr") {
            if (voice[msg.guild.id].queue.length === 1) {
                msg.channel.send("You can't remove the first song!")
                return
            }
            msg.channel.send("Removed `" + voice[msg.guild.id].queue.pop().name + "`")
            return
        }
        if (args[0] === "rem" || args[0] === "remove") {
            if (!isNaN(args[1])) {
                let index = parseInt(args[1])
                if (index > 0 && index < voice[msg.guild.id].queue.length) {
                    msg.channel.send("Removed `" + voice[msg.guild.id].queue.splice(index, 1)[0].name + "`")
                    return
                }
            }
            msg.channel.send("Invalid index! Number must be between 1-" + (voice[msg.guild.id].queue.length - 1))
            return
        }
        if (!isNaN(args[0])) {
            let index = parseInt(args[0])
            if (index >= 0 && index < voice[msg.guild.id].queue.length) {
                msg.channel.send({
                    embed: {
                        color: 14506163,
                        title: "Play Queue - Showing Item: " + index,
                        description:
                            "Title: " + (voice[msg.guild.id].queue[index].name || "Unknown") +
                            "\nURL: " + (voice[msg.guild.id].queue[index].link || "Unknown") +
                            "\nDuration: " + (voice[msg.guild.id].queue[index].link || "Unknown") +
                            "\nThumbnail: " + (voice[msg.guild.id].queue[index].img || "Unknown") +
                            "\nDescription: " + (voice[msg.guild.id].queue[index].desc || "Unknown")
                    }
                })
                return
            }
            msg.channel.send("Invalid index! Number must be between 0-" + (voice[msg.guild.id].queue.length - 1))
            return
        }
        let songs = []
        let len = voice[msg.guild.id].queue.length < 16 ? voice[msg.guild.id].queue.length : 16
        for (let i = 0; i < len; i++) {
            num = i
            if (num === 0) num = "NP: "
            else num += ". "
            let song = voice[msg.guild.id].queue[i].name
            if (voice[msg.guild.id].queue[i].duration) song += " (" + voice[msg.guild.id].queue[i].duration + ")"
            songs.push(num + "`" + song + "`")
        }
        if (voice[msg.guild.id].queue.length > 16) songs.push("and " + (voice[msg.guild.id].queue.length - 16) + " more...")
        msg.channel.send({
            embed: {
                color: 14506163,
                title: "Play Queue - " + voice[msg.guild.id].queue.length + " Items",
                description: songs.join("\n")
            }
        })
    }
}