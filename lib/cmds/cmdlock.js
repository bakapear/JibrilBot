module.exports = {
    name: ["cmdlock"],
    desc: "Locks all bot commands (except for this one) into one channel.",
    permission: "ADMINISTRATOR",
    usage: "<channel id>",
    args: 0,
    command: async function (msg, cmd, args) {
        if (args.length < 1) {
            if (lockChannel !== null) {
                lockChannel = null;
                msg.channel.send("Removed cmdlock.");
            }
            else {
                msg.channel.send("No channel set.");
            }
            return;
        }
        let channel = bot.channels.get(args[0]);
        if (!channel) { msg.channel.send("Invalid channel ID!"); return; }
        if (channel.type !== "text") { msg.channel.send("Not a text channel!"); return; }
        lockChannel = channel;
        msg.channel.send("Cmdlock set on #" + channel.name)
    }
}