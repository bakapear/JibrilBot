const got = require("got");
const api_imgur = process.env.API_IMGUR;
//not working rn

module.exports = {
    name: ["imgur", "igg"],
    desc: "Uploads any picture to imgur and retrieves url with some data!",
    permission: "",
    usage: "<url>",
    args: 1,
    command: async function (msg, cmd, args) {
        got("https://api.imgur.com/3/image?type=url", { method: "POST", headers: { "Authorization": `Client-ID ${api_imgur}` }, json: {image: args[0]} }, function (error, response, body) {
            console.log(body);
        });
        return;
        msg.channel.send({
            embed: {
                color: 9094948,
                title: body.data.link,
                url: body.data.link,
                description: `**Resolution** ${body.data.width}x${body.data.height}\n**Size** ${body.data.size / 1000}KB\n**Type** ${body.data.type}`,
                thumbnail: {
                    url: body.data.link
                }
            }
        });
    }
}