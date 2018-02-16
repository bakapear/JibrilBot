const got = require("got");

module.exports = {
    name: ["rnduser"],
    desc: "Gives you a random user profile!",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        const res = await got("https://api.randomuser.me", { json: true });
        msg.channel.send({
            embed: {
                color: 13158600,
                author: {
                    name: "Random User Profile",
                    icon_url: "https://i.imgur.com/s4IRi8S.png"
                },
                thumbnail: {
                    url: res.body.results[0].picture.medium
                },
                fields: [{
                    name: "Profile",
                    value: `**Name** ${res.body.results[0].name.first} ${res.body.results[0].name.last}\n**Street** ${res.body.results[0].location.street}\n**City** ${res.body.results[0].location.city}\n**State** ${res.body.results[0].location.state}\n**Phone** ${res.body.results[0].phone}\n**E-Mail** ${res.body.results[0].email}`
                },
                {
                    name: "Login",
                    value: `**Username** ${res.body.results[0].login.username}\n**Password** ${res.body.results[0].login.password}`
                }],
            }
        });
    }
}