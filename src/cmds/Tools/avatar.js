/* global bot, cfg */

module.exports = {
  name: ['avatar', 'avt'],
  desc: 'Displays an avatar.',
  permission: '',
  usage: '(user)',
  args: 0,
  command: async function (msg, cmd, args) {
    let avatar = cfg.img
    if (args.length > 0) {
      let member = bot.users.find(x => x.username.toLowerCase().indexOf(args.join(' ').toLowerCase()) >= 0)
      if (member) avatar = member.avatarURL
      else {
        msg.channel.send('Invalid user!')
        return
      }
    }
    msg.channel.send({ embed: { image: { url: avatar } } })
  }
}
