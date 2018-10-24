let got = require("got")
let api_osu = process.env.API_OSU

module.exports = {
    name: ["osu"],
    desc: "Displays a osu! profile",
    permission: "",
    usage: "<user>",
    args: 1,
    command: async function (msg, cmd, args) {
        let url = `https://osu.ppy.sh/api/get_user?u=${args[0]}&k=${api_osu}`
        let body = (await got(url, { json: true })).body
        if (!body[0]) {
            msg.channel.send("User not found!")
            return
        }
        if (!body[0].pp_rank) {
            msg.channel.send("No information for that user!")
            return
        }
        msg.channel.send({
            embed: {
                color: 15033501,
                author: {
                    name: `osu! Profile`,
                    icon_url: `https://i.imgur.com/oEbzSZU.png`
                },
                title: `${body[0].username} :flag_${body[0].country.toLowerCase()}:`,
                url: `https://osu.ppy.sh/u/${body[0].user_id}`,
                thumbnail: {
                    url: `https://a.ppy.sh/${body[0].user_id}`
                },
                fields: [{
                    name: `Statistics`,
                    value: `**Ranked** #${body[0].pp_rank}\n**PP** ${body[0].pp_raw}pp\n**Accuracy** ${parseFloat(body[0].accuracy).toFixed(2)}%\n**Level** ${body[0].level}\n**Play Count** ${body[0].playcount}`
                },
                {
                    name: "Misc",
                    value: `**Ranked Score** ${body[0].ranked_score}\n**Total Score** ${body[0].total_score}\n**SS** ${body[0].count_rank_ss} **SSH** ${body[0].count_rank_ssh} **S** ${body[0].count_rank_s} **SH** ${body[0].count_rank_sh} **A** ${body[0].count_rank_a}\n**300x** ${body[0].count300} **100x** ${body[0].count100} **50x** ${body[0].count50}`
                }],
            }
        })
    }
}