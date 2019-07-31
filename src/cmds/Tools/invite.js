/* global bot */

module.exports = {
  name: ['invite', 'inv'],
  desc: 'Gives information about the bot with invite link.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let invitelink = `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=2146958583`
    msg.channel.send({
      embed: {
        color: 14506163,
        title: `Invite ${bot.user.username} to your server!`,
        description: `${process.env.npm_package_description}\n\n**Guilds** ${bot.guilds.size} **Users** ${bot.users.size} **Channels** ${bot.channels.size}\n**Uptime** \`${t(process.uptime())}\``,
        url: invitelink,
        thumbnail: {
          url: bot.user.avatarURL
        },
        footer: {
          text: 'created and managed by pear#5124'
        }
      }
    })
  }
}

function t (s) {
  let d = Math.floor(s / (3600 * 24))
  let a = new Date(s * 1000).toISOString().substr(11, 8)
  return `${d} Days ${a}`
}
