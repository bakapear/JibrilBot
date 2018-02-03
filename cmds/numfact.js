const request = require("request");

module.exports = {
    name: ["numfact"],
    desc: "Displays a number fact!",
    permission: "",
    usage: "(trivia/date/year/math) (number)",
    args: 0,
    command: function (msg, cmd, args) {
        let link;
        let search = "random";
        if (args[1] != undefined) {
            search = args[1];
        }
        switch (args[0]) {
            case "trivia": { link = `http://numbersapi.com/${search}/trivia`; break; }
            case "date": { link = `http://numbersapi.com/${search}/date`; break; }
            case "year": { link = `http://numbersapi.com/${search}/year`; break; }
            case "math": { link = `http://numbersapi.com/${search}/math`; break; }
            case undefined: { link = `http://numbersapi.com/random/`; break; }
            default: { msg.channel.send("Invalid argument!"); return; }
        }
        request({
            url: link,
            json: true
        }, function (error, response, body) {
            if (body.startsWith("Cannot GET") || body.startsWith("Invalid url")) {
                msg.channel.send("Nothing found!");
            }
            else {
                msg.channel.send(body);
            }
        });
    }
}