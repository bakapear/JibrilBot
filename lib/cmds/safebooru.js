let got = require("got");

module.exports = {
    name: ["safebooru", "booru", "boorep"],
    desc: "otaku weeb normie command for special delivery inspired by special recipe",
    permission: "",
    usage: "(query)",
    args: 0,
    command: async function (msg, cmd, args) {
        let query = args ? msg.content.slice(cmd.length + 1) : "";
        if (cmd == "boorep") {
            let xml = await getComments(query);
            let matches = xml.match(/body="(.*?)"/g)
            let mod = msg.content.startsWith(".") ? Math.floor(Math.random() * matches.length) : 0;
            let comment = decodeHTML(matches[mod].substring(6, matches[mod].length - 1));
            msg.channel.send(comment)
            return;
        }
        let body = await getPosts(query);
        if (!body || !body.length) { msg.channel.send("Nothing found!"); return; }
        let mod = msg.content.startsWith(".") ? Math.floor(Math.random() * body.length) : 0;
        msg.channel.send({
            embed: {
                image: {
                    url: "https://safebooru.org/images/" + body[mod].directory + "/" + body[mod].image
                }
            },
        });
    }
}

async function getPosts(query) {
    let url = "http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=100&json=1&tags=" + encodeURIComponent(query.trim());
    let body = (await got(url, { json: true })).body;
    return body;
}

async function getComments(id) {
    let url = "http://safebooru.org/index.php?page=dapi&s=comment&q=index&post_id=" + encodeURIComponent(id.trim());
    let body = (await got(url)).body;
    return body;
}

function decodeHTML(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
    });
}