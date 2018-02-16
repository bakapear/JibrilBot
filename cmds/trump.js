const got = require("got");

module.exports = {
    name: ["trump"],
    desc: "Prints out a trump quote.",
    permission: "",
    usage: "(something)",
    args: 0,
    command: async function (msg, cmd, args) {
        const res = await got("https://api.whatdoestrumpthink.com/api/v1/quotes", { json: true });
        if (args == "") msg.channel.send(res.body.messages.non_personalized[Math.floor(Math.random() * res.body.messages.non_personalized.length)]);
        else msg.channel.send(`${msg.content.slice(cmd.length + 1)} ${res.body.messages.personalized[Math.floor(Math.random() * res.body.messages.personalized.length)]}`);
    }
}