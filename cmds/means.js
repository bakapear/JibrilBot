let got = require("got");

module.exports = {
    name: ["means"],
    desc: "Searches words that have similar meaning to your given words.",
    permission: "",
    usage: "<words>",
    args: 1,
    command: async function (msg, cmd, args) {
        let url = "https://api.datamuse.com/words?ml=" + encodeURIComponent(msg.content.slice(cmd.length + 1).trim());
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