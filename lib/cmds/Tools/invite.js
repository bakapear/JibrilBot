module.exports = {
    name: ["invite", "inv"],
    desc: "Gives information about the bot with invite link.",
    permission: "",
    usage: "",
    args: 0,
    command: async function (msg, cmd, args) {
        let invitelink = `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=2146958583`
        let uptime = new Date(Date.now() - boot)
        msg.channel.send({
            embed: {
                color: 14506163,
                title: `Invite ${bot.user.username} to your server!`,
                description: `The youngest and strongest discord bot of the Flügel race.\n\n**Guilds** ${bot.guilds.size} **Users** ${bot.users.size} **Channels** ${bot.channels.size}\n**Uptime** ${uptime.getHours()} Hours ${uptime.getMinutes()} Minutes ${uptime.getSeconds()} Seconds`,
                url: invitelink,
                thumbnail: {
                    url: bot.user.avatarURL
                },
                footer: {
                    text: "created and managed by pear#5124"
                }
            }
        })
    }
}