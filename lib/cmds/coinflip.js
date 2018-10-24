module.exports = {
	name: ["coin", "flip", "coinflip"],
	desc: "Flips a coin!",
	permission: "",
	usage: "",
	args: 0,
	command: async function (msg, cmd, args) {
		let side = ["Tails", "Heads"]
		msg.channel.send(`It's **${side[Math.round(Math.random())]}!**`)
	}
}