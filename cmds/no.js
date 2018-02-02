const request = require("request");

module.exports = {
    name: ["no"],
    desc: "Displays a random no gif.",
    permission: "",
    usage: "",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        request({
            url: `https://yesno.wtf/api?force=no`,
            json: true
        }, function (error, response, body) {
            msg.channel.send({
                embed: {
                    image: {
                        url: body.image
                    }
                },
            });
        });
    }
}