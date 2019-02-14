let { doChecks, checks, voice, showPlayMessage, playQueue } = global

module.exports = {
  name: ['radio', 'r', 'fradio'],
  desc: 'Streams the listen.moe anime radio in the voicechannel.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    if (doChecks(checks, msg, 2)) return
    if (!voice[msg.guild.id].chan) {
      voice[msg.guild.id].chan = msg.member.voiceChannel
      voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
    }
    let song = { type: 'radio', link: 'https://listen.moe/opus', name: 'listen.moe radio', img: 'https://i.imgur.com/QDXarfh.png' }
    if (args[0] === 'lofi') song = { type: 'lofi', link: 'http://hyades.shoutca.st:8043/stream', name: 'lofi hiphop radio', img: 'https://i.imgur.com/JmIX0sh.jpg' }
    if (args[0] === 'kpop') song = { type: 'radio', link: 'https://listen.moe/kpop/opus', name: 'listen.moe kpop radio', img: 'https://i.imgur.com/QDXarfh.png' }
    if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
      let last = 1
      if (cmd === 'fradio') voice[msg.guild.id].queue.splice(1, 0, song)
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
