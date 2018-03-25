const ytdl = require("ytdl-core");
const got = require("got");
const api_google = process.env.API_GOOGLE;
let dispatcher;

module.exports = {
    name: ["play"],
    desc: "Streams audio from a youtube video into the voicechannel.",
    permission: "",
    usage: "<query|url>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return }
        if (voiceq[msg.guild.id].playing !== 0 && voiceq[msg.guild.id].playing !== "play") { msg.channel.send("Something is already playing!"); return; }
        const data = getQueryData(msg.content.slice(cmd.length + 1));
        let songs = [];
        let count = 0;
        if ("q" in data || "v" in data) {
            let id;
            if ("q" in data) {
                const body = (await got(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${encodeURIComponent(data.q.trim())}&key=${api_google}`, { json: true })).body;
                if (!body.items.length) { msg.channel.send("Nothing found!"); return; }
                const mod = msg.content.startsWith(".") ? Math.floor(Math.random() * body.items.length) : 0;
                id = body.items[mod].id.videoId;
            }
            else {
                if (!ytdl.validateID(data.v)) { msg.channel.send("Invalid ID!"); return; }
                id = data.v;
            }
            const body = (await got(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${api_google}`, { json: true })).body;
            songs.push([id, body.items[0].snippet.title, body.items[0].snippet.thumbnails.default.url, body.items[0].snippet.thumbnails.medium.url]);

        }
        else if ("list" in data) {
            const body = (await got(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${data.list}&key=${api_google}`, { json: true })).body;
            //Unhandled rejection: HTTPError: Response code 404 (Not Found)
            if (!body.items.length) { msg.channel.send("Nothing found!"); return; }
            for (var i = 0; i < body.items.length; i++) {
                songs.push([body.items[i].snippet.resourceId.videoId, body.items[i].snippet.title, body.items[i].snippet.thumbnails.default.url, body.items[i].snippet.thumbnails.medium.url]);
            }
            count = body.items.length;
        }
        for (var i = 0; i < songs.length; i++) {
            voiceq[msg.guild.id].songs.push(songs[i]);
        }
        if (voiceq[msg.guild.id].playing !== "play") {
            voiceq[msg.guild.id].playing = "play";
            msg.member.voiceChannel.join().then(connection => {
                playQueue(msg, connection, voiceq[msg.guild.id].songs[0][0]);
            });
        }
        else {
            if (songs.length > 1) printAddList(msg, count, songs[0][3]);
            else printAddVideo(msg, songs[0][0], songs[0][1], songs[0][3]);
        }

    },
    skip: function () {
        dispatcher.end();
    }
}

function getQueryData(input) {
    if (ytdl.validateURL(input) || input.indexOf("playlist?list=") >= 0) {
        var id;
        if (input.indexOf("youtu.be/") >= 0) id = input.substring(input.indexOf("youtu.be/") + 9, input.indexOf("?"));
        input = input.substring(input.indexOf("?") + 1);
        if (id) input += "&v=" + id;
        return JSON.parse('{"' + decodeURI(input).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    }
    return { q: input };
}

function printNowPlaying(msg, id, title, thumbnail) {
    msg.channel.send({
        embed: {
            color: 14506163,
            title: "Now Playing",
            url: "https://youtube.com/watch?v=" + id,
            description: "\`" + title + "\`",
            image: {
                url: thumbnail
            }
        }
    });
}

function printAddVideo(msg, id, title, thumbnail) {
    msg.channel.send({
        embed: {
            color: 14506163,
            title: "Added to Queue",
            description: "\`" + title + "\`",
            url: "https://youtube.com/watch?v=" + id,
            thumbnail: {
                url: thumbnail
            }
        }
    });
}

function printAddList(msg, count, thumbnail) {
    msg.channel.send({
        embed: {
            color: 14506163,
            title: "Added Playlist to Queue",
            description: "\`" + count + " Videos\`",
            thumbnail: {
                url: thumbnail
            }
        }
    });
}

function playQueue(msg, connection, streamurl) {
    printNowPlaying(msg, voiceq[msg.guild.id].songs[0][0], voiceq[msg.guild.id].songs[0][1], voiceq[msg.guild.id].songs[0][2]);
    const stream = ytdl(streamurl, { audioonly: true });
    dispatcher = connection.playStream(stream);
    dispatcher.setBitrate(96000);
    dispatcher.on("end", () => {
        stream.destroy();
        voiceq[msg.guild.id].songs.shift();
        if (!voiceq[msg.guild.id].songs.length) { voiceq[msg.guild.id].playing = 0; return };
        playQueue(msg, connection, voiceq[msg.guild.id].songs[0][0]);
    });
    dispatcher.on("error", err => {
        console.log(err);
    });
}