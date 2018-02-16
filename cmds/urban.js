const got = require("got");

module.exports = {
    name: ["urb", "urban"],
    desc: "The Urban Dictionary that gives you information about some words.",
    permission: "",
    usage: "<word>",
    args: 1,
    command: async function (msg, cmd, args) {
        const res = await got(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`, { json: true });
        if (res.body.list.length < 1) { msg.channel.send("Nothing found!"); return; }
        if (!res.body.list[0]) { msg.channel.send("No information about that!"); return; }
        let mod = 0;
        if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * res.body.list.length);
        msg.channel.send({
            embed: {
                color: 16777060,
                author: {
                    name: "Urban Dictionary",
                    icon_url: "https://i.imgur.com/RZrNvTL.jpg"
                },
                title: res.body.list[mod].word,
                url: res.body.list[mod].permalink,
                fields: [{
                    name: "Definition",
                    value: `${res.body.list[mod].definition.substring(0, 1020)}...`
                },
                {
                    name: "Example",
                    value: res.body.list[mod].example
                }],
                footer: {
                    text: `by ${res.body.list[mod].author}`
                },
            }
        });
    }
}