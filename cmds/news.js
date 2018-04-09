const got = require("got");
const api_news = process.env.API_NEWS; //add to .env file cuz did this on other pc

module.exports = {
    name: ["news"],
    desc: "Gets the latest news for given country.",
    permission: "",
    usage: "<country>",
    args: 1,
    command: async function (msg, cmd, args) {
        var body = getHeadlines(args[0]);
        if(!body.totalResults) {msg.channel.send("Nothing found!"); return;}
        var mod = msg.content.startsWith(".") ? Math.floor(Math.random() * body.articles.length) : 0;
        body = body.articles[mod];
        msg.channel.send({
            embed: {
                title: body.title,
                url: body.url,
                description: body.description,
                image: {
                    url: body.urlToImage
                },
                footer: {
                    text: body.author + " @ " + body.publishedAt
                }
            },
        });
    }
}

async function getHeadlines(country) {
    var url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${api_news}`;
    var body = (await got(url, { json: true })).body;
    return body;
}

getHeadlines("wdja").then(e => {
    console.log(e);
});
