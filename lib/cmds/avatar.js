module.exports = {
    name: ["avatar", "avt"],
    desc: "Displays an avatar",
    permission: "",
    usage: "(user mention)",
    args: 0,
    command: async function (msg, cmd, args) {
        let avatarimg;
        if (args == "") avatarimg = msg.author.avatarURL;
        else {
            let member = msg.mentions.members.first();
            if (!member) { msg.channel.send("Invalid user!"); return; }
            avatarimg = member.user.avatarURL;
        }
        msg.channel.send({
            embed: {
                image: {
                    url: avatarimg
                }
            },
        });
    }
}