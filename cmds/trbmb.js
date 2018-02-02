const request = require("request");

module.exports = {
    name: ["trbmb"],
    desc: "That really helps my command! Idk.",
    permission: "",
    usage: "",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        request({
            url: `http://api.chew.pro/trbmb`,
            json: true
        }, function (error, response, body) {
            msg.channel.send(body[0]);
        });
    }
}