const request = require("request");

module.exports = {
    name: ["trump"],
    desc: "Prints out a trump quote.",
    permission: "",
    usage: "(something)",
    args: 0,
    command: function (msg, cmd, args) {
        request({
            url: `https://api.whatdoestrumpthink.com/api/v1/quotes`,
            json: true
        }, function (error, response, body) {
            if (args == "") {
                msg.channel.send(body.messages.non_personalized[Math.floor(Math.random() * body.messages.non_personalized.length)]);
            }
            else {
                msg.channel.send(`${msg.content.slice(cmd.length + 1)} ${body.messages.personalized[Math.floor(Math.random() * body.messages.personalized.length)]}`);
            }
        });
    }
}