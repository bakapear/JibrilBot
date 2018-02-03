const google = require("google");

module.exports = {
    name: ["g", "google"],
    desc: "Google something!",
    permission: "",
    usage: "<query>",
    args: 1,
    command: function (msg, cmd, args) {
        google(args.join(" "), function (error, res) {
            if (error) console.error(error);
            let full = [];
            for (i = 0; i < res.links.length; i++) {
                if (res.links[i].title != null && res.links[i].description != null && res.links[i].href != null) {
                    full.push(res.links[i]);
                }
            }
            if (full.length < 1) {
                msg.channel.send("Nothing found!");
                return;
            }
            let mod = 0;
            if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * full.length);
            msg.channel.send({
                embed: {
                    color: 1231312,
                    title: full[mod].title,
                    url: full[mod].href,
                    description: full[mod].description,
                },
            });
        });
    }
}