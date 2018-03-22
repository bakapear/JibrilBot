const got = require("got");

module.exports = {
    name: ["leet","1337"],
    desc: "Converts your text into leetspeak m8.",
    permission: "",
    usage: "",
    args: 1,
    command: async function (msg, cmd, args) {
        const body = (await got(`http://api.genr8rs.com/Generator/Fun/LeetSpeakGenerator?_sText=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&_sCharacterSet=classic`, { json: true })).body;
        msg.channel.send(body._sResult);
    }
}