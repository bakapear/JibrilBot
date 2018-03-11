const got = require("got");

module.exports = {
    name: ["math"],
    desc: "Gives you the ability to do math stuff! ",
    permission: "",
    usage: "<math stuff>",
    args: 1,
    command: async function (msg, cmd, args) {
        const res = await got(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`, { json: true });
        msg.channel.send(res.body);
    }
}