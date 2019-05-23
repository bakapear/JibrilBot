let { cfg } = global
let got = require('got')

module.exports = {
  name: ['pixiv'],
  desc: 'Searches pixiv for image.',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await searchPixiv(args.join(' '))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    msg.channel.send({ embed: { image: { url: body[mod].image_urls.large } } })
  }
}

async function searchPixiv (text) {
  try {
    let url = 'https://api.pixiv.moe/v1/search'
    let body = (await got(url, {
      query: {
        word: text
      },
      json: true
    })).body
    if (body.status === 'failure') return null
    return body.response
  } catch (e) { if (e) return null }
}
