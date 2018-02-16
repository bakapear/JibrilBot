const got = require("got");
const api_google = process.env.API_GOOGLE;

module.exports = {
    name: ["youtube", "yt"],
    desc: "Displays a video link.",
    permission: "",
    usage: "<query>",
    args: 1,
    command: async function (msg, cmd, args) {
        const res = await got(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&key=api_google`, { json: true });
        if (res.body.items.length < 1) { msg.channel.send("Nothing found!"); return; }
        let mod = 0;
        if (msg.content.startsWith(".")) mod = Math.floor(Math.random() * res.body.items.length);
        msg.channel.send(`https://www.youtube.com/watch?v=${res.body.items[mod].id.videoId}`);
    }
}