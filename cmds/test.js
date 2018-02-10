var Scraper = require ('images-scraper'), google = new Scraper.Google();

module.exports = {
    name: ["wow"],
    desc: "Does some test stuff",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        google.list({
            keyword: args.join(" "),
            num: 100,
            detail: true,
            nightmare: {
                show: false
            }
        })
        .then(function (res) {
			if (res.length < 1) {
				msg.channel.send("Nothing found!");
				return;
			}
			let mod = 0;
			if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * res.length);
			msg.channel.send({
				embed: {
					image: {
						url: res[mod].url
					}
				},
			});
        });
    }
}