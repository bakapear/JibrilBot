module.exports = {
    name: ["pick", "choose"],
    desc: "Picks a choice from multiple. Seperator: `;`",
    permission: "",
    usage: "<choice1 ; choice2 ; choice3...>",
    args: 1,
    command: async function (msg, cmd, args) {
        let parts = msg.content.slice(cmd.length + 1).split(";")
        if (parts.length < 2) {
            msg.channel.send("Please enter atleast 2 things to choose from!")
            return
        }
        let rnd = Math.floor(Math.random() * parts.length)
        msg.channel.send(`I choose **${parts[rnd].trim()}**, because ${res[Math.floor(Math.random() * res.length)]}`)
    }
}

let res = [
    "I felt like choosing that.",
    "why not!",
    "that's the best option.",
    "that's better than the rest.",
    "that stood out the most."
]