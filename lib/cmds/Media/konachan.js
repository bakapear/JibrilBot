let { cfg } = global
let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['konachan', 'kona'],
  desc: 'Gets pics from konachan!',
  permission: '',
  usage: '(tags)',
  args: 0,
  command: async function (msg, cmd, args) {
    let body = await getPost(args.join(' '))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    let rating = body[mod].rating
    if (rating === 's') rating = 'safe'
    msg.channel.send({ embed: { image: { url: body[mod].file_url },
      footer: {
        text: body[mod].score + ' | ' + rating + ' | ' + body[mod].tags.substr(0, 1000)
      } } })
  }
}

async function getPost (tags) {
  try {
    if (tags) {
      let url = 'https://konachan.net/post.json'
      let body = (await got(url, {
        query: {
          limit: 100,
          tags: tags
        },
        json: true
      })).body
      body = body.filter(x => x.rating !== 'e' && x.rating !== 'q')
      return body
    } else {
      let searchRandom = async () => {
        let url = 'https://konachan.net/post/random'
        let body = (await got(url)).body
        return cheerio.load(body)
      }
      let $ = await searchRandom()
      let i = 0
      while (!$('.original-file-unchanged')[0]) {
        if (i > 50) return null
        i++
        $ = await searchRandom()
      }
      return [{
        rating: 's',
        tags: $('#post_tags').text(),
        score: 0,
        file_url: $('.original-file-unchanged')[0].attribs.href
      }]
    }
  } catch (e) { if (e) return null }
}
