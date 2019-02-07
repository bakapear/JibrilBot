module.exports = {
  name: ['avatar', 'avt'],
  desc: 'Displays an avatar.',
  permission: '',
  usage: '(user)',
  args: 0,
  command: async function (msg, cmd, args) {
    let avatar = msg.author.avatarURL
    if (args.length > 0) {
      let member = msg.mentions.members.first()
      if (member) avatar = member.user.avatarURL
      else {
        msg.channel.send('Invalid user!')
        return
      }
    }
    msg.channel.send({ embed: { image: { url: avatar } } })
  }
}
