let { cfg } = global
let got = require('got')

module.exports = {
  name: ['pr0', 'pr0gramm'],
  desc: 'Gets a random pr0gramm pic or vid',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let url = 'http://pr0gramm.com/api/items/get'
    let body = (await got(url, { json: true })).body
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.items.length) : 0
    let item = 'https://img.pr0gramm.com/' + body.items[mod].image
    if (item.endsWith('mp4')) {
      msg.channel.send(item)
      return
    }
    msg.channel.send({ embed: { image: { url: item } } })
  }
}
