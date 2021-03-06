/* global cfg */
let got = require('got')

module.exports = {
  name: ['catgirl', 'neko'],
  desc: 'Displays a catgirl of your choice.',
  permission: '',
  usage: '(tags)',
  args: 0,
  command: async function (msg, cmd, args) {
    let url = 'https://nekos.moe/api/v1/images/search'
    let opts = {
      method: 'POST',
      body: { nsfw: false, tags: args.join(' ') },
      json: true
    }
    let body = (await got(url, opts)).body
    if (body.images.length < 1) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.images.length) : 0
    let img = 'https://nekos.moe/image/' + body.images[mod].id
    msg.channel.send({ embed: { image: { url: img } } })
  }
}
