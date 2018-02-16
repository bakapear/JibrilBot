const got = require("got");

module.exports = {
    name: ["catgirl"],
    desc: "Displays a random catgirl.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const res = await got("https://nekos.brussell.me/api/v1/random/image?nsfw=false", { json: true, headers: { "User-Agent": "Jibril" } });
        if (res.body.images.length < 1) { msg.channel.send("Nothing found!"); return; }
        msg.channel.send({
            embed: {
                image: {
                    url: `https://nekos.brussell.me/image/${res.body.images[0].id}`
                }
            },
        });
    }
}