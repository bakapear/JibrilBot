const got = require("got");
const api_giphy = process.env.API_GIPHY;

module.exports = {
    name: ["gif"],
    desc: "Displays a gif for the given tags. Picks a random one if no tags given.",
    permission: "",
    usage: "(search tags)",
    args: 0,
    command: async function (msg, cmd, args) {
        const body = (await got(`http://api.giphy.com/v1/gifs/random?tag=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`, {
            json: true, 
            query: {
                api_key: api_giphy,
                rating: "r",
                format: "json",
                limit: 1
            }
        })).body;
        if (!body.data.image_url) { msg.channel.send("Nothing found!"); return; }
        msg.channel.send({
            embed: {
                image: {
                    url: body.data.image_url
                }
            },
        });
    }
}