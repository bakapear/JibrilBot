let { doChecks, checks, voice, showPlayMessage, playQueue, cfg } = global
let got = require('got')

module.exports = {
  name: ['tfsound', 'tfsnd', 'ftfsnd', 'ftfsound'],
  desc: 'Plays a voice sound from TF2',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    if (doChecks(checks, msg, 3)) return
    if (!voice[msg.guild.id].chan) {
      voice[msg.guild.id].chan = msg.member.voiceChannel
      voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
    }
    let mod = msg.content.startsWith(cfg.prefix.random)
    let song = await getSound(args.join(' '), mod)
    if (!song) {
      msg.channel.send('Nothing found!')
      return
    }
    if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
      let last = 1
      if (cmd === 'ftfsnd' || cmd === 'ftfsound') voice[msg.guild.id].queue.splice(1, 0, song)
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

function searchSound (str, obj) {
  str = str.trim().toLowerCase().split(/_|\.| /)
  let matches = obj.items.filter((x, i) => {
    if (str.join('') === '#' + i) return true
    if (x.reco === null) x.reco = ''
    let parts = x.path.split(/_|\./).concat(x.reco.split(' ')).filter(x => x !== '').map(x => x.toLowerCase())
    if (str.every(y => parts.some(z => z.match(escapeRegExp(y))))) return true
  })
  return matches
}

async function getSound (query, rnd) {
  let url = 'https://raw.githubusercontent.com/bakapear/tfvoices/master/data.json'
  let body = (await got(url, { json: true })).body
  let matched = searchSound(query.trim(), body)
  if (!matched.length) return
  let mod = rnd ? Math.floor(Math.random() * matched.length) : 0
  return {
    type: 'tfsnd',
    link: body.url + matched[mod].path,
    name: `\`${matched[mod].path}\`\n${matched[mod].reco}`
  }
}

function escapeRegExp (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
