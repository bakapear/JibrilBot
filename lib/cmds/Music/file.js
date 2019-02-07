let { doChecks, checks, voice, showPlayMessage, playQueue } = global

module.exports = {
  name: ['file', 'ffile'],
  desc: 'Play audio from url',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    if (doChecks(checks, msg, 3)) return
    if (!voice[msg.guild.id].chan) {
      voice[msg.guild.id].chan = msg.member.voiceChannel
      voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
    }
    let song = { type: 'file', link: args[0], name: args[0] }
    if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
      let last = 1
      if (cmd === 'ffile') voice[msg.guild.id].queue.splice(1, 0, song)
      else {
        voice[msg.guild.id].queue.push(song)
        last = voice[msg.guild.id].queue.length - 1
      }
      showPlayMessage(msg, 'Added to Queue', voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
    } else {
      voice[msg.guild.id].queue = []
      voice[msg.guild.id].queue.push(song)
      voice[msg.guild.id].msg = msg
      playQueue(msg)
    }
  }
}
