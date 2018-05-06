//For Beel
let got = require("got");

module.exports = {
    name: ["thighs", "thighsthatrequiremuchworktoget"],
    desc: "Gets a random thigh image for beel",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let rnd = msg.content.startsWith(".") ? true : false;
        let body = await getRedditThighs(msg, rnd);
        msg.channel.send({
            embed: {
                image: {
                    url: body
                }
            }
        });
    }
}
async function getRedditThighs(msg, rnd) {
    let thighs = [
"thighs","hipcleavage","thickthighs","perfectthighs","asianthighs","sexysittingthighs"
];
let url = "https://api.reddit.com/r/" + thighs[Math.floor(Math.random() * thighs.length)] + "/?limit=100&restrict_sr=true";
    let body = (await got(url, { json: true })).body.data.children;
    if (!body || !body.length) { msg.channel.send("Nothing found!"); return }
    let post = [];
    for (let i = 0; i < body.length; i++) {
        if (body[i].data.post_hint === "image")
            post.push(body[i]);
    }
    if (!post.length) { msg.channel.send("Nothing found for that!"); return }
    let mod = rnd ? Math.floor(Math.random() * post.length) : 0;
    let data = post[mod].data;
    return data.url
}