const request = require("request");

module.exports = {
    name: ["math"],
    desc: "Gives you the ability to do math stuff! ",
    permission: "",
    usage: "<math stuff>",
    args: 1,
    command: function (msg, cmd, args) {
        request({
            url: `http://api.mathjs.org/v1/?expr=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
            json: true
        }, function (error, response, body) {
            msg.channel.send(body);
        });
    }
}