const request = require("request");
const api_giphy = process.env.API_GIPHY;

module.exports = {
    name: ["gif"],
    desc: "Displays a gif for the given tags. Picks a random one if no tags given.",
    permission: "",
    usage: "(search tags)",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        request({
            url: `http://api.giphy.com/v1/gifs/random?tag=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
            qs: {
                api_key: api_giphy,
                rating: "r",
                format: "json",
                limit: 1
            },
            json: true
        }, function (error, response, body) {
            if (body.data.image_url == undefined) {
                msg.channel.send("Nothing found!");
            }
            else {
                msg.channel.send({
                    embed: {
                        image: {
                            url: body.data.image_url
                        }
                    },
                });
            }
        });
    }
}