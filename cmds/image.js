const request = require("request");

module.exports = {
	name: ["i", "img", "image"],
	desc: "Displays a picture. This command uses the Qwant Search Engine to find pictures!",
	permission: "",
	usage: "<query>",
	args: 1,
	command: function (msg, cmd, args) {
		request({
			url: `https://api.qwant.com/api/search/images?count=100&safesearch=1&locale=en_US&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
			headers: {
				"User-Agent": "Jibril"
			},
			json: true
		}, function (error, response, body) {
			if (body == undefined) {
				msg.channel.send("Image servers down! Please try again later.");
				return;
			}
			if (body.data.result.items.length < 1) {
				msg.channel.send("Nothing found!");
				return;
			}
			let mod = 0;
			if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.data.result.items.length);
			msg.channel.send({
				embed: {
					image: {
						url: body.data.result.items[mod].media
					}
				},
			});
		})
	}
}