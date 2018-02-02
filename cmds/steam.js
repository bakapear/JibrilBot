const request = require("request");
const api_steam = process.env.API_STEAM;

module.exports = {
    name: ["steam"],
    desc: "Displays a steam profile!",
    permission: "",
    usage: "<customurl>",
    needargs: true,
    command: function (boot, msg, cmd, args) {
        let steamid;
        request({
            url: `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?vanityurl=${args[0]}`,
            qs: {
                key: api_steam
            },
            json: true
        }, function (error, response, body) {
            if (body.response.success != 1) {
                msg.channel.send("User not found!");
            }
            else {
                request({
                    url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?steamids=${body.response.steamid}`,
                    qs: {
                        key: api_steam
                    },
                    json: true
                }, function (error, response, body) {
                    let date = new Date(body.response.players[0].timecreated * 1000);
                    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    let time = `${date.getDate()}th ${months[date.getMonth()]} ${date.getFullYear()}`;
                    let flag = "";
                    if (body.response.players[0].loccountrycode != undefined) { flag = `:flag_${body.response.players[0].loccountrycode.toLowerCase()}:` }
                    msg.channel.send({
                        embed: {
                            color: 6579455,
                            author: {
                                name: "Steam Profile",
                                icon_url: `https://i.imgur.com/cNqF7U8.png`
                            },
                            title: `${body.response.players[0].personaname} ${flag}`,
                            url: body.response.players[0].profileurl,
                            thumbnail: {
                                url: body.response.players[0].avatarfull
                            },
                            fields: [{
                                name: "Statistics",
                                value: `**Created on** ${time}\n**URL** ${body.response.players[0].profileurl}`
                            }],
                        }
                    });
                })
            }
        });
    }
}