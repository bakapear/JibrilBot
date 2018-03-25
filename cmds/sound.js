const got = require("got");
const api_github = process.env.API_GITHUB;
let dispatcher;

module.exports = {
    name: ["snd", "sound"],
    desc: "Plays a sound from Metastruct/garrysmod-chatsounds repo.",
    permission: "",
    usage: "<query>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return }
        if (voiceq[msg.guild.id].playing !== 0) { msg.channel.send("Something is already playing!"); return; }
        const body = (await got(`https://api.github.com/search/code?q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}+in:path+extension:ogg+path:sound/chatsounds/autoadd+repo:Metastruct/garrysmod-chatsounds&access_token=${api_github}`, { json: true, headers: { "User-Agent": "Jibril" } })).body;
        if (!body.total_count) { msg.channel.send("Nothing found!"); return; }
        msg.member.voiceChannel.join().then(connection => {
            voiceq[msg.guild.id].playing = "sound";
            const mod = msg.content.startsWith(".") ? Math.floor(Math.random() * body.items.length) : 0;
            playSound(msg, connection, body.items[mod].path, body.items[mod].name);
        });
    },
    skip: function () {
        dispatcher.end();
    }
}

function printSound(msg, file, link) {
    msg.channel.send({
        embed: {
            color: 14506163,
            title: "Playing Sound",
            url: link,
            description: "\`" + file + "\`"
        }
    });
}

function playSound(msg, connection, streamurl, name) {
    const link = `https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/${encodeURIComponent(streamurl.trim())}`;
    printSound(msg, name, link);
    dispatcher = connection.playArbitraryInput(link);
    dispatcher.setBitrate(96000);
    dispatcher.on("end", () => {
        dispatcher = null;
        voiceq[msg.guild.id].playing = 0;
    });
    dispatcher.on("error", err => {
        console.log(err);
    });
}