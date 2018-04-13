let got = require("got");

module.exports = {
    name: ["dad"],
    desc: "Prints out a terrible dad joke.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let body = (await got("https://icanhazdadjoke.com/", { json: true })).body;
        msg.channel.send(body.joke);
    }
}