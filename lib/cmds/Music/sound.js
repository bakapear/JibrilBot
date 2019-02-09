let { doChecks, checks, voice, showPlayMessage, playQueue, cfg } = global
let got = require('got')
let apiGithub = process.env.API_GITHUB

module.exports = {
  name: ['snd', 'sound', 'fsnd', 'fsound'],
  desc: 'Plays a sound from Metastruct/garrysmod-chatsounds repo.',
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
      if (cmd === 'fsnd' || cmd === 'fsound') voice[msg.guild.id].queue.splice(1, 0, song)
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

async function getSound (query, rnd) {
  let url = `https://api.github.com/search/code?q=${encodeURIComponent(query.trim())}+in:path+extension:ogg+path:sound/chatsounds/autoadd+repo:Metastruct/garrysmod-chatsounds&access_token=${apiGithub}`
  let body = (await got(url, { json: true, headers: { 'User-Agent': 'Jibril' } })).body
  if (!body.total_count) return
  let mod = rnd ? Math.floor(Math.random() * body.items.length) : 0
  return {
    type: 'sound',
    link: `https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/${encodeURIComponent(body.items[mod].path.trim())}`,
    name: body.items[mod].name
  }
}
