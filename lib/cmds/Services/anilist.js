let { cfg } = global
let got = require('got')

module.exports = {
  name: ['ani', 'anilist'],
  desc: 'Search for anime on AniList!',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await searchAni(args.join(' '))
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
    let desc = body[mod].description
    if (desc.length > 210) {
      let arr = desc.substr(0, 210).split(' ')
      arr.pop()
      desc = arr.join(' ') + '...'
    }
    let date = new Date()
    date.setFullYear(body[mod].startDate.year, body[mod].startDate.month, body[mod].startDate.day)
    msg.channel.send({ embed: {
      title: item.title.romaji,
      color: 4044018,
      url: item.siteUrl,
      description: desc,
      thumbnail: {
        url: item.coverImage.large
      },
      timestamp: date.toLocaleDateString(),
      footer: {
        text: `${item.meanScore}/100 | ${item.episodes} Episodes | ${item.type}`
      }
    } })
  }
}

async function searchAni (search) {
  try {
    let variables = { search: search, perPage: 5 }
    let query = 'query ($id: Int, $page: Int, $perPage: Int, $search: String) { Page(page: $page, perPage: $perPage) { media(id: $id, search: $search) { id title { romaji } description startDate { year month day } type episodes coverImage { large } meanScore siteUrl } } }'
    let url = 'https://graphql.anilist.co'
    let { body } = await got(url, {
      body: { query: query, variables: variables },
      json: true
    })
    return body.data.Page.media
  } catch (e) { if (e) return null }
}
