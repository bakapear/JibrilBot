const got = require("got");

module.exports = {
    name: ["reddit"],
    desc: "Gets a reddit post with an image.",
    permission: "",
    usage: "(subreddit) ; (query)",
    args: 0,
    command: async function (msg, cmd, args) {
        if (args[1] == ";") { var sr = args[0]; args.splice(0, 2); }
        const rnd = msg.content.startsWith(".") ? true : false;
        const body = await getRedditPost(msg, rnd, sr, args.join(" "))
        if (body.type == "image") {
            msg.channel.send({
                embed: {
                    title: body.title,
                    url: body.url,
                    color: 16777215,
                    image: {
                        url: body.link
                    },
                    footer: {
                        text: body.sr
                    }
                },
            });
        }
        else {
            msg.channel.send({
                embed: {
                    title: body.title,
                    url: body.url,
                    description: body.text,
                    color: 16777215,
                    footer: {
                        text: body.sr
                    }
                },
            });
        }
    }
}

async function getRedditPost(msg, rnd, subreddit, query) {
    var sr = subreddit ? "r/" + subreddit + "/" : "";
    var q = query ? "search/?limit=100&restrict_sr=true&q=" + encodeURIComponent(query.trim()) + "/" : "hot/?limit=100&restrict_sr=true";
    var url = "http://api.reddit.com/" + sr + q;
    const body = (await got(url, { json: true })).body.data.children;
    if (!body || !body.length) { msg.channel.send("Nothing found!"); return }
    let post = [];
    for (var i = 0; i < body.length; i++) {
        if (body[i].data.post_hint === "image")
            post.push(body[i]);
        if (body[i].data.post_hint === undefined && body[i].data.selftext !== "")
            post.push(body[i]);
    }
    if (!post.length) { msg.channel.send("Nothing found for that!"); return }
    var mod = rnd ? Math.floor(Math.random() * post.length) : 0;
    var data = post[mod].data;
    return {
        title: data.title.substring(0, 250),
        text: data.selftext.substring(0, 1020),
        link: data.url,
        url: "https://reddit.com" + data.permalink,
        sr: data.subreddit_name_prefixed,
        id: data.name,
        type: data.post_hint
    }
}