let got = require("got");

module.exports = {
    name: ["chuck", "norris"],
    desc: "Prints out a chuck norris joke.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let body = (await got("https://api.chucknorris.io/jokes/random", { json: true })).body;
        msg.channel.send(body.value);
    }
}