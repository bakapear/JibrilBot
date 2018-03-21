const got = require("got");

module.exports = {
    name: ["numfact"],
    desc: "Displays a number fact!",
    permission: "",
    usage: "(number) (trivia/date/year/math)",
    args: 0,
    command: async function (msg, cmd, args) {
        let link;
        let search = "random";
        if (args[0]) search = args[0];
        switch (args[1]) {
            case "trivia": { link = `http://numbersapi.com/${search}/trivia`; break; }
            case "date": { link = `http://numbersapi.com/${search}/date`; break; }
            case "year": { link = `http://numbersapi.com/${search}/year`; break; }
            case "math": { link = `http://numbersapi.com/${search}/math`; break; }
            default: { link = `http://numbersapi.com/${search}`; break; }
        }
        const body = (await got(link)).body;
        if (body.startsWith("Cannot GET") || body.startsWith("Invalid url")) { msg.channel.send("Nothing found!"); return; }
        msg.channel.send(body);
    }
}