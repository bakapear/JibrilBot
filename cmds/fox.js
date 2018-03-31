const got = require("got");

module.exports = {
    name: ["fox"],
    desc: "Displays a random cute fox picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const body = (await got("https://randomfox.ca/floof", { json: true })).body;
        msg.channel.send({
            embed: {
                image: {
                    url: body.image
                }
            },
        });
    }
}