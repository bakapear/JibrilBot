const got = require("got");
const api_google = process.env.API_GOOGLE;

module.exports = {
    name: ["youtube", "yt"],
    desc: "Displays a video link or converts it into audio/video.",
    permission: "",
    usage: "(mp3/mp4) ; <query>",
    args: 1,
    command: async function (msg, cmd, args) {
        let method = "";
        if (args[1] == ";") { method = args[0]; args.splice(0, 2); }
        let videoid = "";
        if (args[0].startsWith("https://") || args[0].startsWith("http://")) {
            videoid = formatVideoId(msg.content.slice(cmd.length + 1));
            if (videoid == -1) { msg.channel.send("Invalid Link!"); return; }
        }
        else {
            const res = await got(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&key=${api_google}`, { json: true });
            if (res.body.items.length < 1) { msg.channel.send("Nothing found!"); return; }
            let mod = 0;
            if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * res.body.items.length);
            videoid = res.body.items[mod].id.videoId;
        }
        if (method == "mp3") {
            const res2 = await got(`https://youtubetoany.com/@api/json/mp3/${videoid}`);
            var index = res2.body.indexOf("<script");
            const json = JSON.parse(res2.body.substring(0, index));
            if (!json.vidInfo || json.vidInfo.length < 1) { msg.channel.send("Nothing found!"); return; }
            let downloads = [];
            for (i = 0; i < 5; i++) {
                downloads.push(`[${json.vidInfo[i].bitrate} kbit/s - ${json.vidInfo[i].mp3size}](https:${json.vidInfo[i].dloadUrl})\n`);
            }
            msg.channel.send({
                embed: {
                    color: 382329,
                    title: json.vidTitle,
                    description: downloads.join("").substring(0, 2045)
                }
            });
            return;
        }
        if (method == "mp4") {
            const res2 = await got(`https://youtubetoany.com/@api/json/videos/${videoid}`);
            var index = 2000;
            if(res2.body.indexOf("<script") != -1) index = res2.body.indexOf("<script");
            const json = JSON.parse(res2.body.substring(0, index));
            if (!json.vidInfo || json.vidInfo.length < 1) { msg.channel.send("Nothing found!"); return; }
            let downloads = [];
            for (i = 0; i < 5; i++) {
                downloads.push(`[${json.vidInfo[i].quality}p - ${json.vidInfo[i].rSize}](https:${json.vidInfo[i].dloadUrl})\n`);
            }
            msg.channel.send({
                embed: {
                    color: 382329,
                    title: json.vidTitle,
                    description: downloads.join("").substring(0, 2045)
                }
            });
            return;
        }
        msg.channel.send(`https://www.youtube.com/watch?v=${videoid}`);
    }
}

function formatVideoId(input) {
    var index = input.indexOf("?v=") != -1 ? input.indexOf("?v=") : -1;
    var output;
    if (index != -1) {
        output = input.substring(index + 3);
        if (output.indexOf("&") != -1) {
            output = input.substring(0, input.indexOf("&"));
        }
        return output;
    }
    else {
        return -1;
    }
}