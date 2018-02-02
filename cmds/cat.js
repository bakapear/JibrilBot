const request = require("request");

module.exports = {
    name: ["cat"],
    desc: "Displays a random cat picture.",
    permission: "",
    usage: "",
    needargs: false,
    command: function (boot, msg, cmd, args) {
        request({
            url: "http://random.cat/meow.php",
            json: true
        }, function (error, response, body) {
            msg.channel.send({
                embed: {
                    image: {
                        url: body.file
                    }
                },
            });
        });
    }
}