const got = require("got");

module.exports = {
    name: ["cat"],
    desc: "Displays a random cute cat picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const body = (await got("http://random.cat/meow.php", { json: true })).body;
        msg.channel.send({
            embed: {
                image: {
                    url: body.file
                }
            },
        });
    }
}