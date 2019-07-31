/* global cfg */
let got = require('got')

module.exports = {
  name: ['mal', 'myanimelist'],
  desc: 'Search for anime on MAL!',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await searchMAL(args.join(' '))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    let item = body[mod]
    msg.channel.send({ embed: {
      title: item.title,
      color: 3035554,
      url: item.url,
      description: item.synopsis,
      thumbnail: {
        url: item.image_url
      },
      timestamp: item.start_date,
      footer: {
        text: `${item.score}/10 | ${item.episodes} Episodes | ${item.type}`
      }
    } })
  }
}

async function searchMAL (query) {
  try {
    let url = 'https://api.jikan.moe/v3/search/anime'
    let { body } = await got(url, { query: { q: query, limit: 5 }, json: true })
    return body.results
  } catch (e) { if (e) return null }
}
