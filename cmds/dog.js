const got = require("got");

module.exports = {
    name: ["dog"],
    desc: "Displays a random dog picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const body = (await got("https://dog.ceo/api/breeds/image/random", { json: true })).body;
        msg.channel.send({
            embed: {
                image: {
                    url: body.message
                }
            },
        });
    }
}