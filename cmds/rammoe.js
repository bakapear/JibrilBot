const got = require("got");

module.exports = {
    name: ["nyan", "lick", "cuddle", "smug", "hug", "cute", "kiss", "chu", "pat", "pout", "cry", "stare", "triggered", "slap", "weird", "tickle", "lewd", "owo", "nom", "clap", "potato"],
    desc: `Displays a random gif of the given type.`,
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const res = await got(`https://rra.ram.moe/i/r?type=${cmd}`, { json: true });
        msg.channel.send({
            embed: {
                image: {
                    url: `https://rra.ram.moe${res.body.path}`
                }
            },
        });
    }
}