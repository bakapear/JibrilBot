module.exports = {
    name: ["musiclock"],
    desc: "Shows music related messages only in one channel.",
    permission: "ADMINISTRATOR",
    usage: "<channel id>",
    args: 0,
    command: async function (msg, cmd, args) {
        if (args.length < 1) {
            if (musicChannel !== null) {
                musicChannel = null
                msg.channel.send("Removed musiclock.")
            }
            else {
                msg.channel.send("No channel set.")
            }
            return;
        }
        let channel = bot.channels.get(args[0])
        if (!channel) { msg.channel.send("Invalid channel ID!"); return; }
        if (channel.type !== "text") { msg.channel.send("Not a text channel!"); return; }
        musicChannel = channel
        msg.channel.send("Musiclock set on #" + channel.name)
    }
}