/* global cfg */
let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['image', 'img', 'i'],
  desc: 'Displays an image from Google.',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let images = await collectImages(args.join(' '))
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * images.length) : 0
    if (!images || !images.length || !images[mod]) {
      msg.channel.send('Nothing found!')
      return
    }
    msg.channel.send({ embed: { image: { url: images[mod].original.url } } })
  }
}

async function collectImages (query) {
  query = encodeURIComponent(query)
  let url = `https://www.google.com/search?q=${query}&source=lnms&tbm=isch&sa=X&hl=en&safe=off`
  let { body } = await got(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:64.0) Gecko/20100101 Firefox/64.0' }
  })
  let $ = cheerio.load(body)
  let meta = $('.rg_meta')
  let result = []
  for (let i = 0; i < meta.length; i++) {
    let data = JSON.parse(meta[i].children[0].data)
    let item = {
      original: {
        url: data.ou,
        width: data.ow,
        height: data.oh
      },
      thumbnail: {
        url: data.tu,
        width: data.tw,
        height: data.th
      }
    }
    result.push(item)
  }
  if (!result.length) {
    let start = body.indexOf('function(){return [', body.indexOf("key: 'ds:2'")) + 18
    let end = body.indexOf('}});</script>', start) - 1
    let json = JSON.parse(body.substring(start, end))[31][0][12][2]
    for (let i = 0; i < json.length; i++) {
      let data = json[i][1]
      if (!data) continue
      let item = {
        original: {
          url: data[3][0],
          width: data[3][2],
          height: data[3][1]
        },
        thumbnail: {
          url: data[2][0],
          width: data[2][2],
          height: data[2][1]
        }
      }
      result.push(item)
    }
  }
  return result.filter(x => x.original.url.indexOf('fbsbx.com/') < 0)
}
