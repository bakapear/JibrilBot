const yt = require("ytdl-core");

module.exports = {
    name: ["tea"],
    desc: "Does some test stuff",
    permission: "",
    usage: "",
    args: 0,
    command: function (msg, cmd, args) {
        msg.member.voiceChannel.join().then(connection => {
            let toast = connection.playStream(yt("http://www.youtube.com/watch?v=A02s8omM_hI", { audioonly: true }));
            toast.setBitrate(96000);
            toast.on('error', console.error);
        });
    }
}