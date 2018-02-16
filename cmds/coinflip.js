module.exports = {
	name: ["coin", "flip", "coinflip"],
	desc: "Flips a coin!",
	permission: "",
	usage: "",
	args: 0,
	command: function (msg, cmd, args) {
		if (Math.random() >= 0.5) msg.channel.send("It's **Tails!**");
		else msg.channel.send("It's **Heads!**");
	}
}