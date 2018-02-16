const got = require("got");

module.exports = {
	name: ["i", "img", "image"],
	desc: "Displays a picture. This command uses the Qwant Search Engine to find pictures!",
	permission: "",
	usage: "<query>",
	args: 1,
	command: async function (msg, cmd, args) {
		const res = await got(`https://api.qwant.com/api/search/images?count=100&safesearch=1&locale=en_US&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`, { json: true, headers: { "User-Agent": "Jibril" } });
		if (!res.body) { msg.channel.send("Something went wrong! Please try again later."); return; }
		if (res.body.data.result.items.length < 1) { msg.channel.send("Nothing found!"); return; }
		let mod = 0;
		if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * res.body.data.result.items.length);
		msg.channel.send({
			embed: {
				image: {
					url: res.body.data.result.items[mod].media
				}
			},
		});
	}
}