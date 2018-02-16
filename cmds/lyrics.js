const got = require("got");
const api_musix = process.env.API_MUSIX;

module.exports = {
    name: ["lyrics"],
    desc: "Gives you the entire lyrics of a song!",
    permission: "",
    usage: "<lyrics/song>",
    args: 1,
    command: async function (msg, cmd, args) {
        const res = await got(`http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&page_size=3&page=1&s_track_rating=desc&apikey=${api_musix}`, { json: true });
        if (res.body.message.header.available < 1) { msg.channel.send("Nothing found!"); return; }
        let tracktitle = `${res.body.message.body.track_list[0].track.artist_name} - ${res.body.message.body.track_list[0].track.track_name}`;
        const res2 = await got(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${res.body.message.body.track_list[0].track.track_id}&apikey=${api_musix}`, { json: true });
        if (res2.body.message.header.status_code == 404) { msg.channel.send("Nothing found!"); return; }
        msg.channel.send({
            embed: {
                color: 14024703,
                title: tracktitle,
                description: res2.body.message.body.lyrics.lyrics_body.slice(0, -70).substring(0, 1020)
            },
        });
    }
}