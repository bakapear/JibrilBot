const request = require("request");
const api_google = process.env.API_GOOGLE;

module.exports = {
    name: ["toen", "translate"],
    desc: "Translate anything!",
    permission: "",
    usage: "<source lang> <target lang> <text>",
    args: 1,
    command: function (msg, cmd, args) {
        let source;
        let target;
        if (cmd == "toen") {
            source = "auto";
            target = "en"
        }
        else {
            source = args.shift();
            target = args.shift();
        }
        request({
            url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(args.join(" ").trim())}`,
            json: true
        }, function (error, response, body) {
            msg.channel.send(body[0][0][0]);
        });
    }
}