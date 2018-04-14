let got = require("got");
let ifunny = require("ifunny");

module.exports = {
    name: ["fun", "ifunny"],
    desc: "Displays a random ifunny picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let mod = msg.content.startsWith(".") ? true : false;
        let body = await ifunny({ shuffle: mod });
        let data = body.result[Math.floor(Math.random() * body.result.length)];
        if (data.type == "mp4") { msg.channel.send(data.src); return; }
        msg.channel.send({
            embed: {
                image: {
                    url: data.src
                }
            }
        });
    }
}