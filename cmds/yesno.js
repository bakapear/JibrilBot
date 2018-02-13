const request = require("request");

module.exports = {
    name: ["yes", "no", "maybe"],
    desc: "Displays a random yes/no/maybe gif.",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        request({
            url: `https://yesno.wtf/api?force=${cmd}`,
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