let { cfg } = global
let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['wikihow', 'wh'],
  desc: 'Gets a wikihow image',
  permission: '',
  usage: '(query)',
  args: 0,
  command: async function (msg, cmd, args) {
    let res = await getWikiImage(args.join(' '), msg.content.startsWith(cfg.prefix.random))
    if (res.error) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!res.body.length) {
      msg.channel.send('Nothing found!')
      return
    }
    msg.channel.send({ embed: { image: { url: res.body[0] } } })
  }
}

async function getWikiImage (query, rnd) {
  let url = 'https://www.wikihow.com/wikiHowTo'
  let body = (await got(url, { query: {
    search: query || '*',
    start: query ? (rnd ? Math.floor(Math.random() * 148000) : '0') : Math.floor(Math.random() * 148000)
  } })).body

  let $ = cheerio.load(body)
  let imgs = $('.result_thumb > img')
  let pics = []
  for (let i = 0; i < imgs.length; i++) {
    let src = imgs[i].attribs.src
    if (src.indexOf('no_img') < 0) {
      pics.push(src)
    }
  }
  return { body: pics }
}
