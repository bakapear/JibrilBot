const request = require("request");
var base64Img = require('base64-img');
const api_imgur = process.env.API_IMGUR;

module.exports = {
    name: ["imgur", "ig"],
    desc: "Uploads any picture to imgur and retrieves url + some data!",
    permission: "",
    usage: "<image link>",
    args: 1,
    command: function (msg, cmd, args) {
        base64Img.requestBase64(args[0], function(err, res, body) {
            request({
                url: `https://api.imgur.com/3/image`,
                method: "POST",
                headers: {
                    "Authorization": `Client-ID ${api_imgur}`
                },
                json: body.substring(22)
            }, function (error, response, body) {
                msg.channel.send({
                    embed: {
                        color: 9094948,
                        title: body.data.link,
                        url: body.data.link,
                        description: `**Resolution** ${body.data.width}x${body.data.height}\n**Size** ${body.data.size/1000}KB\n**Type** ${body.data.type}`,
                        thumbnail: {
                            url: body.data.link
                        }
                    }
                });
            });
        });
    }
}