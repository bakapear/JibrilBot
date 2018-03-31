const got = require("got");

module.exports = {
    name: ["shibe"],
    desc: "Displays a random cute shibe picture.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const body = (await got("http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=false", { json: true })).body;
        msg.channel.send({
            embed: {
                image: {
                    url: body[0]
                }
            },
        });
    }
}