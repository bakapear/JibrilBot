const request = require("request");
const api_musix = process.env.API_MUSIX;

module.exports = {
    name: ["lyrics"],
    desc: "Gives you the entire lyrics of a song!",
    permission: "",
    usage: "<lyrics/song>",
    args: 1,
    command: function (boot, msg, cmd, args) {
        request({
            url: `http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&page_size=3&page=1&s_track_rating=desc`,
            qs: {
                apikey: api_musix
            },
            json: true
        }, function (error, response, body) {
            if (body.message.header.available < 1) {
                msg.channel.send("Nothing found!");
                return;
            }
            let tracktitle = `${body.message.body.track_list[0].track.artist_name} - ${body.message.body.track_list[0].track.track_name}`;
            request({
                url: `http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${body.message.body.track_list[0].track.track_id}`,
                qs: {
                    apikey: api_musix
                },
                json: true
            }, function (error, response, body) {
                if (body.message.header.status_code == 404) {
                    msg.channel.send("Nothing found!");
                    return;
                }
                msg.channel.send({
                    embed: {
                        color: 14024703,
                        title: tracktitle,
                        description: body.message.body.lyrics.lyrics_body.substring(0, 1020).slice(0, -70)
                    },
                });
            });
        });
    }
}