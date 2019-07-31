/* global cfg */
let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['gleit', 'gel'],
  desc: 'beels fav command so far',
  permission: '',
  usage: '(tags)',
  args: 0,
  command: async function (msg, cmd, args) {
    let body = await getPost(args)
    if (!body || !body.length || !body[0]) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    let img = body[mod].file_url
    let rating = body[mod].rating
    if (rating === 's') rating = 'safe'
    if (rating === 'q') rating = 'questionable'
    if (rating === 'e') rating = 'explicit'
    msg.channel.send({ embed: { image: { url: img },
      footer: {
        text: body[mod].score + ' | ' + rating + ' | ' + body[mod].tag_string.substr(0, 1000)
      } } })
    if (img.endsWith('.webm') || img.endsWith('.mp4')) {
      msg.channel.send(img)
    }
  }
}

async function getPost (tags) {
  let url = 'https://gelbooru.com/index.php'
  let body = (await got(url, {
    query: {
      tags: tags.join(' '),
      limit: 1000,
      page: 'dapi',
      s: 'post',
      q: 'index',
      pid: 0
    }
  })).body
  let $ = cheerio.load(body, { xmlMode: true })
  let posts = $('post')
  let res = []
  for (let i = 0; i < posts.length; i++) {
    res.push({
      file_url: posts[i].attribs.file_url,
      score: posts[i].attribs.score,
      rating: posts[i].attribs.rating,
      tag_string: posts[i].attribs.tags.trim()
    })
  }
  res = res.filter(x => !x.tag_string.includes('scat') && !x.tag_string.includes('guro') && !x.tag_string.includes('furry') && !x.tag_string.includes('astolfo_(fate)'))
  return res
}
