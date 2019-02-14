let { doChecks, checks, voice, showPlayMessage, playQueue } = global
let got = require('got')

module.exports = {
  name: ['inspire', 'finspire'],
  desc: 'Inspire yourself',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    if (doChecks(checks, msg, 2)) return
    if (!voice[msg.guild.id].chan) {
      voice[msg.guild.id].chan = msg.member.voiceChannel
      voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
    }
    let flow = await generateInspiroFlow()
    if (!flow) {
      msg.channel.send('Something went wrong!')
      return
    }
    let song = { type: 'file', link: flow.url, name: flow.name, img: 'https://i.imgur.com/EgpcDSe.png' }
    if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
      let last = 1
      if (cmd === 'finspire') voice[msg.guild.id].queue.splice(1, 0, song)
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

async function generateInspiroFlow () {
  try {
    let url = 'https://inspirobot.me/api?generateFlow=1'
    let body = (await got(url, { json: true })).body
    return { url: body.mp3, name: body.data[1].text }
  } catch (e) { if (e) return null }
}
