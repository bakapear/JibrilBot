const request = require("request");

module.exports = {
    name: ["trbmb"],
    desc: "That really helps my command!",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        request({
            url: `http://api.chew.pro/trbmb`,
            json: true
        }, function (error, response, body) {
            msg.channel.send(body[0]);
        });
    }
}