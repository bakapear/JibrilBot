/* global cfg */
let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['osk', 'osuskin'],
  desc: 'Search for a sexy osu! skin',
  permission: '',
  usage: '(query)',
  args: 0,
  command: async function (msg, cmd, args) {
    let skins = await searchSkins(args.join(' '))
    if (!skins) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!skins.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * skins.length) : 0
    msg.channel.send({
      embed: {
        title: skins[mod].name,
        url: skins[mod].url,
        color: 15033501,
        image: {
          url: skins[mod].img
        }
      }
    })
  }
}

async function searchSkins (query) {
  try {
    let url = 'http://skins.osuck.net/'
    let html = null
    if (query) {
      html = (await got.post(url, {
        form: true,
        body: {
          do: 'search',
          subaction: 'search',
          story: query
        }
      })).body
    } else {
      html = (await got(url)).body
    }
    let $ = cheerio.load(html)
    let cards = $('.col-xs-12.col-sm-6.col-md-6')
    let pack = []
    for (let i = 0; i < cards.length; i++) {
      let card = $(cards[i])
      pack.push({
        name: card.find('.panel-title.txt-dark a')[0].children[0].data,
        url: card.find('.panel-title.txt-dark a')[0].attribs.href,
        img: 'http://skins.osuck.net' + card.find('.item.active img')[0].attribs.src
      })
    }
    console.log(pack)
    return pack
  } catch (e) { if (e) return null }
}
