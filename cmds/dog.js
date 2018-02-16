const got = require("got");

module.exports = {
    name: ["dog"],
    desc: "Displays a random dog picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const res = await got("https://dog.ceo/api/breeds/image/random", { json: true });
        msg.channel.send({
            embed: {
                image: {
                    url: res.body.message
                }
            },
        });
    }
}