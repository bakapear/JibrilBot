let got = require("got");
let api_github = process.env.API_GITHUB;
let dispatcher;

module.exports = {
    name: ["tfsound", "tfsnd"],
    desc: "Plays a voice sound from TF2",
    permission: "",
    usage: "<query>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return }
        if (voiceq[msg.guild.id].playing !== 0) { msg.channel.send("Something is already playing!"); return; }
        let body = (await got("https://raw.githubusercontent.com/bakapear/tfvoices/master/src/full.json", { json: true })).body
        let matched = searchSound(msg.content.slice(cmd.length + 1).trim(), body)
        if (!matched.length) { msg.channel.send("Nothing found!"); return; }
        msg.member.voiceChannel.join().then(connection => {
            voiceq[msg.guild.id].playing = "tfsound";
            let mod = msg.content.startsWith(".") ? Math.floor(Math.random() * matched.length) : 0;
            playSound(msg, connection, body.url, matched[mod]);
        });
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

function playSound(msg, connection, origin, path) {
    let link = origin + path;
    printSound(msg, path, link);
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

function searchSound(query, array) {
    query = query.trim().toLowerCase()
    let matched = []
    for (let i = 0; i < array.files.length; i++) {
        if (array.files[i].text.toLowerCase().match(query) || array.files[i].path.toLowerCase().match(query)) {
            matched.push(array.files[i].path)
        }
    }
    return matched
}