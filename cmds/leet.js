const got = require("got");

module.exports = {
    name: ["leet","1337"],
    desc: "Converts your text into leetspeak m8. Types: classic, ultra, glyphtek, wolfenstein, fancy, beefy, broadway, fullwidth",
    permission: "",
    usage: "(type) ; <text>",
    args: 1,
    command: async function (msg, cmd, args) {
        let mode = "classic"
        if(args[1] == ";") {
           mode = args[0];
           args.splice(0,2);
        }
        let types = ["classic", "ultra", "glyphtek", "wolfenstein", "fancy", "beefy", "broadway", "fullwidth"];
        if(!types.includes(mode)) { msg.channel.send("Invalid type!"); return; }
        const body = (await got(`http://api.genr8rs.com/Generator/Fun/LeetSpeakGenerator?_sText=${encodeURIComponent(args.join(" ").trim())}&_sCharacterSet=${mode}`, { json: true })).body;
        msg.channel.send(body._sResult);
    }
}