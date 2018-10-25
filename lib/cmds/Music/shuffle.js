module.exports = {
    name: ["shuffle"],
    desc: "Shuffles the entire queue.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!voice[msg.guild.id].queue || !voice[msg.guild.id].queue.length) {
            msg.channel.send("No items in queue!")
            return
        }
        if (voice[msg.guild.id].queue.length > 1) {
            let temp = voice[msg.guild.id].queue.shift()
            voice[msg.guild.id].queue = shuffleArray(voice[msg.guild.id].queue)
            voice[msg.guild.id].queue.unshift(temp)
        }
        msg.channel.send("Shuffled the queue!")
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}