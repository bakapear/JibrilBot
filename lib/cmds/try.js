module.exports = {
    name: ["try"],
    desc: "Basically roll command but more options.",
    permission: "",
    usage: "<min> <max> <target>",
    args: 3,
    command: async function (msg, cmd, args) {
        if (isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2])) {
            msg.channel.send("Invalid numbers!");
            return
        }
        let min = parseInt(args[0])
        let max = parseInt(args[1])
        let target = parseInt(args[2])
        if (min > max) max = [min, min = max][0]
        if (target > max || target < min) {
            msg.channel.send("Search is not between min and max!");
            return
        }
        let count = 0
        let num
        while (num != target) {
            num = Math.floor(Math.random() * (max - min + 1) + min)
            count++
            if (count > 100000) {
                count = "too many"
                break
            }
        }
        msg.channel.send(`Took **${count}** tries to get **${target}** (from **${min}-${max}**)`)
    }
}