const got = require("got");
const api_steam = process.env.API_STEAM;

module.exports = {
    name: ["steam"],
    desc: "Displays a steam profile!",
    permission: "",
    usage: "<customurl/profileid>",
    args: 1,
    command: async function (msg, cmd, args) {
        const input = msg.content.slice(cmd.length + 1).trim();
        let id = await customToId(input);
        if (!id) id = input;
        let body = (await getSteamSummary(id));
        if (!body) { msg.channel.send("User not found!"); return; }
        body = body[0];
        const friends = await getSteamFriends(id);
        let buddies = "N/A";
        if (friends) buddies = (await getSteamSummary(friends[Math.floor(Math.random() * friends.length)].steamid))[0].personaname;
        const date = new Date(body.timecreated * 1000);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const time = `${date.getDate()}th ${months[date.getMonth()]} ${date.getFullYear()}`;
        let flag = "N/A";
        if (body.loccountrycode) flag = `:flag_${body.loccountrycode.toLowerCase()}:`;
        msg.channel.send({
            embed: {
                color: 8555775,
                title: body.personaname,
                url: body.profileurl,
                thumbnail: { url: body.avatarfull },
                description: "**Realname** " + (body.realname ? body.realname : "N/A") + "\n**Country** " + flag + "\n**Created on** " + time + "\n**Friends** " + (friends ? (friends.length ? friends.length : 0) : 0),
                fields: [
                    {
                        name: "Random Friend",
                        value: buddies
                    }
                ]
            }
        });
    }
}

async function getSteamFriends(id) {
    const url = "http://api.steampowered.com/ISteamUser/GetFriendList/v0001/"
    const body = (await got(url, {
        json: true, query: {
            key: api_steam,
            steamid: id,
            relationship: "friend"
        }
    })).body;
    if (!body || body.friendslist.friends.length < 1) return;
    return body.friendslist.friends;
}

async function getSteamSummary(id) {
    const url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/";
    const body = (await got(url, {
        json: true, query: {
            key: api_steam,
            steamids: id
        }
    })).body;
    if (!body || !body.response.players || body.response.players.length < 1) return;
    return body.response.players;
}

async function customToId(customurl) {
    const url = "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/"
    const body = (await got(url, {
        json: true, query: {
            key: api_steam,
            vanityurl: customurl
        }
    })).body;
    if (!body || body.response.success !== 1) return;
    return body.response.steamid;
}