/* global cfg */
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
    let image = await getMoreImageData(body[mod], mod)
    msg.channel.send({
      embed: {
        color: 16767821,
        title: image.title,
        description: image.desc,
        url: image.url,
        image: { url: image.img }
      }
    })
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
      res.push('https://yandex.com' + pics[i].parent.attribs.href)
    }
    return res
  } catch (e) { if (e) return null }
}

async function getMoreImageData (url, index) {
  let body = (await got(url)).body
  let $ = cheerio.load(body)
  let data = JSON.parse($(`.serp-item.serp-item_type_search.serp-item_group_search.serp-item_pos_${index}.serp-item_scale_yes.justifier__item.i-bem`)[0].attribs['data-bem'])['serp-item']
  return {
    title: data.snippet.title,
    desc: data.snippet.text,
    url: data.snippet.url,
    img: data.img_href
  }
}
