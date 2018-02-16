const got = require("got");
const api_osu = process.env.API_OSU;

module.exports = {
    name: ["osu"],
    desc: "Displays a osu! profile",
    permission: "",
    usage: "<user>",
    args: 1,
    command: async function (msg, cmd, args) {
        const res = await got(`https://osu.ppy.sh/api/get_user?u=${args[0]}&k=${api_osu}`, { json: true });
        if (!res.body[0]) { msg.channel.send("User not found!"); return; }
        if (!res.body[0].pp_rank) { msg.channel.send("No information for that user!"); return; }
        msg.channel.send({
            embed: {
                color: 15033501,
                author: {
                    name: `osu! Profile`,
                    icon_url: `https://i.imgur.com/oEbzSZU.png`
                },
                title: `${res.body[0].username} :flag_${res.body[0].country.toLowerCase()}:`,
                url: `https://osu.ppy.sh/u/${res.body[0].user_id}`,
                thumbnail: {
                    url: `https://a.ppy.sh/${res.body[0].user_id}`
                },
                fields: [{
                    name: `Statistics`,
                    value: `**Ranked** #${res.body[0].pp_rank}\n**PP** ${res.body[0].pp_raw}pp\n**Accuracy** ${parseFloat(res.body[0].accuracy).toFixed(2)}%\n**Level** ${res.body[0].level}\n**Play Count** ${res.body[0].playcount}`
                },
                {
                    name: "Misc",
                    value: `**Ranked Score** ${res.body[0].ranked_score}\n**Total Score** ${res.body[0].total_score}\n**SS** ${res.body[0].count_rank_ss} **SSH** ${res.body[0].count_rank_ssh} **S** ${res.body[0].count_rank_s} **SH** ${res.body[0].count_rank_sh} **A** ${res.body[0].count_rank_a}\n**300x** ${res.body[0].count300} **100x** ${res.body[0].count100} **50x** ${res.body[0].count50}`
                }],
            }
        });
    }
}