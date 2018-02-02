const request = require("request");

module.exports = {
    name: ["yes"],
    desc: "Displays a random yes gif.",
    permission: "",
    usage: "",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        request({
            url: `https://yesno.wtf/api?force=yes`,
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