module.exports = {
    name: ["stop","s"],
    desc: "Removes me from the voicechannel.",
    permission: "",
    usage: "",
    args: 0,
    command: function (boot, msg, cmd, args, bot) {
        if (!msg.member.voiceChannel) {
			msg.channel.send("You're not in a voice channel!");
			return
		}
		if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
			msg.channel.send("I'm not in a voice channel!");
			return
		}
		msg.member.voiceChannel.leave();
    }
}