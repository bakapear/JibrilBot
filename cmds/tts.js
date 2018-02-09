const tts = require('google-tts-api');

module.exports = {
    name: ["tts"],
    desc: "Tee",
    permission: "",
    usage: "<query>",
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