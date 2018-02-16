const got = require("got");

module.exports = {
    name: ["trivia"],
    desc: "Asks questions, you should prolly answer.",
    permission: "",
    usage: "(question)",
    args: 0,
    command: function (msg, cmd, args) {
        console.log("new");
    }
}