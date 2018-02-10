const tts = require('google-tts-api');

module.exports = {
    name: ["tts"],
    desc: "Make the bot say something in Text-To-Speech!",
    permission: "",
    usage: "<message>",
    args: 1,
    command: function (msg, cmd, args) {
        tts(args.join(" "), 'en', 1).then(function (url) {
            msg.member.voiceChannel.join().then(connection => {
                let toast = connection.playStream(url);
                toast.setBitrate(96000);
                toast.on('error', console.error);
            });
        });
    }
}