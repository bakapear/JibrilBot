const got = require("got");

module.exports = {
    name: ["cat"],
    desc: "Displays a random cute cat picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const res = await got("http://random.cat/meow.php", { json: true });
        msg.channel.send({
            embed: {
                image: {
                    url: res.body.file
                }
            },
        });
    }
}