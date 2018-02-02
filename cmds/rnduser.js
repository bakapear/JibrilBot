const request = require("request");

module.exports = {
    name: ["rnduser"],
    desc: "Gives you a random user profile!",
    permission: "",
    usage: "",
    args: 0,
    command: function (boot, msg, cmd, args) {
        request({
            url: `https://api.randomuser.me`,
            json: true
        }, function (error, response, body) {
            msg.channel.send({
                embed: {
                    color: 13158600,
                    author: {
                        name: "Random User Profile",
                        icon_url: "https://i.imgur.com/s4IRi8S.png"
                    },
                    thumbnail: {
                        url: body.results[0].picture.medium
                    },
                    fields: [{
                        name: "Profile",
                        value: `**Name** ${body.results[0].name.first} ${body.results[0].name.last}\n**Street** ${body.results[0].location.street}\n**City** ${body.results[0].location.city}\n**State** ${body.results[0].location.state}\n**Phone** ${body.results[0].phone}\n**E-Mail** ${body.results[0].email}`
                    },
                    {
                        name: "Login",
                        value: `**Username** ${body.results[0].login.username}\n**Password** ${body.results[0].login.password}`
                    }],
                }
            });
        });
    }
}