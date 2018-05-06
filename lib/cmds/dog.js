let got = require("got");

module.exports = {
    name: ["dog"],
    desc: "Displays a random cute dog picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let body = (await got("https://random.dog/woof.json", { json: true })).body;
        msg.channel.send({
            embed: {
                image: {
                    url: body.url
                }
            },
        });
    }
}