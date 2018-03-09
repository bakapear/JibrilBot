const got = require("got");

module.exports = {
    name: ["means"],
    desc: "Searches words that have similar meaning to your given words.",
    permission: "",
    usage: "<words>",
    args: 1,
    command: async function (msg, cmd, args) {
        const url = "https://api.datamuse.com/words?ml=" + encodeURIComponent(msg.content.slice(cmd.length + 1).trim());
        const body = (await got(url, { json: true })).body;
        if (body.length < 1) { msg.channel.send("Nothing found!"); return; }
        let wordlist = "";
        let len = body.length < 5 ? body.length : 5;
        if (msg.content.startsWith("-")) len = 1;
        for (var i = 0; i < len; i++) {
            wordlist += body[i].word + "\n";
        }
        msg.channel.send(wordlist);
    }
}

function formatParams(str) {
    var parts = str.split(";");
    for (var i = 0; i < parts.length; i++) {
        var index = parts[i].indexOf(":");
        var param = parts[i].substr(0, index).trim();
        var query = parts[i].substr(index + 1, parts[i].length).trim();
        parts[i] = param + "=" + encodeURIComponent(query);
    }
    return "?" + parts.join("&");
}