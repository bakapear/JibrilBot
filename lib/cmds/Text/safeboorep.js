let got = require("got")

module.exports = {
    name: ["safeboorep", "boorep"],
    desc: "otaku weeb normie command but the comment version",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let id = args[0] || ""
        let url = "http://safebooru.org/index.php?page=dapi&s=comment&q=index&post_id=" + encodeURIComponent(id.trim())
        let xml = (await got(url)).body
        let matches = xml.match(/body="(.*?)"/g)
        let mod = msg.content.startsWith(".") ? Math.floor(Math.random() * matches.length) : 0
        let comment = decodeHTML(matches[mod].substring(6, matches[mod].length - 1))
        msg.channel.send(comment)
    }
}

function decodeHTML(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec)
    })
}