const request = require("request");

module.exports = {
    name: ["catgirl"],
    desc: "Displays a random catgirl.",
    permission: "",
    usage: "",
    args: 0,
    command: function (boot, msg, cmd, args) {
        request({
            url: `https://nekos.brussell.me/api/v1/random/image?nsfw=false`,
            headers: {
                "User-Agent": "Jibril"
            },
            json: true
        }, function (error, response, body) {
            if (body.images.length < 1) {
                msg.channel.send("Nothing found!");
            }
            else {
                msg.channel.send({
                    embed: {
                        image: {
                            url: `https://nekos.brussell.me/image/${body.images[0].id}`
                        }
                    },
                });
            }
        });
    }
}