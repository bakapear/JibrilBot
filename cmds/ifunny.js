let got = require("got");
let ifunny = require("ifunny");

module.exports = {
    name: ["fun", "ifunny"],
    desc: "Displays a random ifunny picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let body = await ifunny({shuffle: true});
        let mod = msg.content.startsWith(".") ? Math.floor(Math.random() * body.items.length) : 0;
        msg.channel.send({
            embed: {
                image: {
                    url: body.result[mod].img
                }
            }
        });
    }
}