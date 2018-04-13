let got = require("got");

module.exports = {
    name: ["rhyme", "rhy"],
    desc: "Searches words that ryhme with your given word.",
    permission: "",
    usage: "<word>",
    args: 1,
    command: async function (msg, cmd, args) {
        let url = "https://api.datamuse.com/words?rel_rhy=" + encodeURIComponent(msg.content.slice(cmd.length + 1).trim());
        let body = (await got(url, { json: true })).body;
        if (body.length < 1) { msg.channel.send("Nothing found!"); return; }
        let wordlist = "";
        let len = body.length < 5 ? body.length : 5;
        if (msg.content.startsWith("-")) len = 1;
        for (let i = 0; i < len; i++) {
            wordlist += body[i].word + "\n";
        }
        msg.channel.send(wordlist);
    }
}

function formatParams(str) {
    let parts = str.split(";");
    for (let i = 0; i < parts.length; i++) {
        let index = parts[i].indexOf(":");
        let param = parts[i].substr(0, index).trim();
        let query = parts[i].substr(index + 1, parts[i].length).trim();
        parts[i] = param + "=" + encodeURIComponent(query);
    }
    return "?" + parts.join("&");
}