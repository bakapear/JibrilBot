/* global cfg */
let got = require('got')

module.exports = {
  name: ['tfsound', 'tfsnd'],
  desc: 'Plays a voice sound from TF2',
  permission: [],
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let Player = global.getPlayer(msg)
    if (!Player) {
      msg.channel.send("You're not in a voice channel!")
      return
    }
    let sound = await getSound(args.join(' '), msg.content.startsWith(cfg.prefix.random))
    let item = await Player.play(sound, msg.author)
    if (!item) msg.channel.send('Nothing found!')
    else if (item.error) msg.channel.send(item.error)
    else if (Player.active) Player.msgQueued(msg, item)
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
    type: 'url',
    url: body.url + matched[mod].path,
    title: `\`${matched[mod].path}\`\n${matched[mod].reco}`
  }
}

function escapeRegExp (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
