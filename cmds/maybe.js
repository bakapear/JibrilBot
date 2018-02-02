const request = require("request");

module.exports = {
    name: ["maybe"],
    desc: "Displays a random maybe gif.",
    permission: "",
    usage: "",
    args: 0,
    command: function (boot, msg, cmd, args) {
        request({
            url: `https://yesno.wtf/api?force=maybe`,
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