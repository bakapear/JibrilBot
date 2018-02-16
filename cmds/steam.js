const got = require("got");
const api_steam = process.env.API_STEAM;

module.exports = {
    name: ["steam"],
    desc: "Displays a steam profile!",
    permission: "",
    usage: "<customurl>",
    args: 1,
    command: async function (msg, cmd, args) {
        const res = await got(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?vanityurl=${args[0]}&key=${api_steam}`, { json: true });
        if (res.body.response.success != 1) { msg.channel.send("User not found!"); return; }
        const res2 = await got(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?steamids=${res.body.response.steamid}&key=${api_steam}`, { json: true });
        let date = new Date(res2.body.response.players[0].timecreated * 1000);
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let time = `${date.getDate()}th ${months[date.getMonth()]} ${date.getFullYear()}`;
        let flag = "";
        if (res2.body.response.players[0].loccountrycode != undefined) { flag = `:flag_${res2.body.response.players[0].loccountrycode.toLowerCase()}:` }
        msg.channel.send({
            embed: {
                color: 6579455,
                author: {
                    name: "Steam Profile",
                    icon_url: `https://i.imgur.com/cNqF7U8.png`
                },
                title: `${res2.body.response.players[0].personaname} ${flag}`,
                url: res2.body.response.players[0].profileurl,
                thumbnail: {
                    url: res2.body.response.players[0].avatarfull
                },
                fields: [{
                    name: "Statistics",
                    value: `**Created on** ${time}\n**URL** ${res2.body.response.players[0].profileurl}`
                }],
            }
        });
    }
}