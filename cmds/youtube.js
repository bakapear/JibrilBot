let ytdl = require("ytdl-core");
let got = require("got");
let fs = require("fs");
let api_google = process.env.API_GOOGLE;

module.exports = {
    name: ["youtube", "yt", "playlist", "yaw"],
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
            if (videoid == -1) { msg.channel.send("Invalid link!"); return; }
        }
        else {
            let type = "video";
            if (cmd == "playlist") type = "playlist"
            let body = (await got(`https://www.googleapis.com/youtube/v3/search?part=id&type=${type}&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&key=${api_google}`, { json: true })).body;
            if (body.items.length < 1) { msg.channel.send("Nothing found!"); return; }
            let mod = 0;
            if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * body.items.length);
            if (cmd == "playlist") {
                msg.channel.send(`https://www.youtube.com/playlist?list=${body.items[mod].id.playlistId}`);
                return;
            }
            videoid = body.items[mod].id.videoId;
        }
        if (method == "mp3") {
            if (!fs.existsSync("./data/temp/")) fs.mkdirSync("./data/temp/");
            let file = `./data/temp/mp3_${msg.author.id}.mp3`;
            let stream = await ytdl("https://youtube.com/watch?v=" + videoid, { filter: "audioonly" })
            stream.pipe(fs.createWriteStream(file));
            stream.on("end", () => {
                msg.channel.send({ file: file });
            });
            return;
        }
        if (method == "mp4") {
            if (!fs.existsSync("./data/temp/")) fs.mkdirSync("./data/temp/");
            let file = `./data/temp/mp4_${msg.author.id}.mp4`;
            let stream = await ytdl("https://youtube.com/watch?v=" + videoid, { filter: "audioandvideo" })
            stream.pipe(fs.createWriteStream(file));
            stream.on("end", () => {
                msg.channel.send({ file: file });
            });
            return;
        }
        msg.channel.send(`https://www.youtube.com/watch?v=${videoid}`);
    }
}

function formatVideoId(input) {
    let index = input.indexOf("?v=") != -1 ? input.indexOf("?v=") : -1;
    let output;
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