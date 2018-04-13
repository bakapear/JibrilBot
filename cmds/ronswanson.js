let got = require("got");

module.exports = {
    name: ["ron", "swanson"],
    desc: "Prints out a ron swanson quote.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let body = (await got("http://ron-swanson-quotes.herokuapp.com/v2/quotes", { json: true })).body;
        msg.channel.send(body[0]);
    }
}