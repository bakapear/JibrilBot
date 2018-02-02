const request = require("request");

module.exports = {
    name: ["dog"],
    desc: "Displays a random dog picture.",
    permission: "",
    usage: "",
    args: 0,
    command: function (boot, msg, cmd, args) {
        request({
            url: "https://dog.ceo/api/breeds/image/random",
            json: true
        }, function (error, response, body) {
            msg.channel.send({
                embed: {
                    image: {
                        url: body.message
                    }
                },
            });
        });
    }
}