let got = require("got");

module.exports = {
    name: ["inspiro"],
    desc: "Displays a random motivational picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let body = (await got("http://inspirobot.me/api?generate=true")).body;
        msg.channel.send({
            embed: {
                image: {
                    url: body
                }
            },
        });
    }
}