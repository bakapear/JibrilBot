const request = require("request");

module.exports = {
    name: ["urb", "urban"],
    desc: "The Urban Dictionary that gives you information about some words.",
    permission: "",
    usage: "<word>",
    args: 1,
    command: function (boot, msg, cmd, args) {
        request({
            url: `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
            json: true
        }, function (error, response, body) {
            if (body.list.length < 1) {
                msg.channel.send("Nothing found!");
            }
            else if (body.list[0] == undefined) {
                msg.channel.send("No information about that!");
            }
            else {
                let mod = 0;
                if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.list.length);
                msg.channel.send({
                    embed: {
                        color: 16777060,
                        author: {
                            name: "Urban Dictionary",
                            icon_url: "https://i.imgur.com/RZrNvTL.jpg"
                        },
                        title: body.list[mod].word,
                        url: body.list[mod].permalink,
                        fields: [{
                            name: "Definition",
                            value: `${body.list[mod].definition.substring(0, 1020)}...`
                        },
                        {
                            name: "Example",
                            value: body.list[mod].example
                        }],
                        footer: {
                            text: `by ${body.list[mod].author}`
                        },
                    }
                });
            }
        });
    }
}