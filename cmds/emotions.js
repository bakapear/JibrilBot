const request = require("request");

module.exports = {
    name: ["lick","cuddle","smug","hug","cute","kiss","chu","pat","pout","cry","stare","triggered","slap","weird","tickle","lewd","owo","nom","clap","potato"],
    desc: `Displays a random gif of the given type.`,
    permission: "",
    usage: "",
    args: 0,
    command: function (boot, msg, cmd, args) {
        request({
            url: `https://rra.ram.moe/i/r?type=${cmd}`,
            json: true
        }, function (error, response, body) {
            msg.channel.send({
                embed: {
                    image: {
                        url: `https://rra.ram.moe${body.path}`
                    }
                },
            });
        });
    }
}