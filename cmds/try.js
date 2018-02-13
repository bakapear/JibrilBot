module.exports = {
    name: ["try"],
    desc: "Test command.",
    permission: "",
    usage: "<min> <max> <target>",
    args: 3,
    command: function (msg, cmd, args) {
        if (isNaN(args[0]) || isNaN(args[1]) || isNaN(args[2])) { msg.channel.send("Invalid numbers!"); return; }
        var min = parseInt(args[0]);
        var max = parseInt(args[1]);
        var target = parseInt(args[2]);
        if(target > max || target < min) {msg.channel.send("Search is not between min and max!"); return;}
        if (min > max) max = [min, min = max][0];
        var count = 0;
        var num;
        while (num != target) {
            num = getRandomInt(min, max);
            count++;
            if(count > 100000) {
                count = "too many";
                break;
            }
        }
        msg.channel.send(`Took **${count}** tries to get **${target}** (from **${min}-${max}**)`);
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
