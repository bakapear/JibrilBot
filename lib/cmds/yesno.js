let got = require("got");

module.exports = {
    name: ["yes", "no", "maybe"],
    desc: "Displays a random yes/no/maybe gif.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let body = (await got(`https://yesno.wtf/api?force=${cmd}`, { json: true })).body;
        msg.channel.send({
            embed: {
                image: {
                    url: body.image
                }
            },
        });
    }
}