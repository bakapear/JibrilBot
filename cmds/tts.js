const tts = require('google-tts-api');
let dispatcher;

module.exports = {
    name: ["tts"],
    desc: "Make the bot say something in Text-To-Speech!",
    permission: "",
    usage: "(language) ; <message>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return }
        if (voiceq[msg.guild.id].playing !== 0) { msg.channel.send("Something is already playing!"); return; }
        let lang = "en";
        if (args[1] == ";") { lang = args[0]; args.splice(0, 2); }
        tts(args.join(" ").substring(0, 200), lang, 1).then(function (url) {
            voiceq[msg.guild.id].playing = "tts";
            msg.member.voiceChannel.join().then(connection => {
                playSpeech(msg, connection, url);
            });
        });

    },
    skip: function () {
        dispatcher.end();
    }
}

function playSpeech(msg, connection, streamurl) {
    dispatcher = connection.playStream(streamurl);
    dispatcher.setBitrate(96000);
    dispatcher.on("end", () => {
        voiceq[msg.guild.id].playing = 0;
    });
    dispatcher.on("error", err => {
        console.log(err);
    });
}