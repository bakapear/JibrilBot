let { cfg } = global
let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['yandex', 'yx'],
  desc: 'Get similar images of an IMAGE!',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getSimilarImages(args.join(' '))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    msg.channel.send({ embed: { image: { url: body[mod] } } })
  }
}

async function getSimilarImages (input) {
  try {
    let url = 'https://yandex.com/images/search'
    let body = (await got(url, {
      query: {
        url: input,
        rpt: 'imageview'
      }
    })).body
    let $ = cheerio.load(body)
    let pics = $('.similar__image')
    let res = []
    for (let i = 0; i < pics.length; i++) {
      let link = pics[i].parent.attribs.href
      link = decodeURIComponent(link.substring(link.indexOf('&img_url=') + 9, link.indexOf('&rpt=imagelike')))
      res.push(link)
    }
    return res
  } catch (e) { if (e) return null }
}
