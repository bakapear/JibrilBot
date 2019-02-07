let { bot, voice } = global

module.exports = {
  name: ['soundchan', 'sndchan'],
  desc: 'Set music related command responses to a specific channel.',
  permission: 'ADMINISTRATOR',
  usage: '<channel id>',
  args: 1,
  command: async function (msg, cmd, args) {
    let channel = bot.channels.get(args[0])
    if (!channel) {
      msg.channel.send('Invalid channel ID!')
      return
    }
    if (channel.type !== 'text') {
      msg.channel.send('Not a text channel!')
      return
    }
    voice[msg.guild.id].msg.channel = channel
    msg.channel.send('Music messages set on #' + channel.name)
  }
}
