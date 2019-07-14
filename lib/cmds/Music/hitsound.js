/* global cfg */
let fs = require('fs')
let path = require('path')

module.exports = {
  name: ['hitsound', 'hitsnd'],
  desc: 'Plays a hitsound from TF2!',
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
    let parts = x.name.split(' ').filter(x => x !== '').map(x => x.toLowerCase())
    if (str.every(y => parts.some(z => z.match(escapeRegExp(y))))) return true
  })
  return matches
}

async function getSound (query, rnd) {
  let body = JSON.parse(fs.readFileSync(path.join(__dirname, '/../', '/../', 'data', 'store', 'hitsounds.json'), { encoding: 'utf-8' }))
  let matched = searchSound(query.trim(), { items: body })
  if (!matched.length) return
  let mod = rnd ? Math.floor(Math.random() * matched.length) : 0
  return {
    type: 'url',
    url: matched[mod].url,
    title: `\`${matched[mod].name}\``
  }
}

function escapeRegExp (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
