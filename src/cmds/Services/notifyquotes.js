/* global cfg */
let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['quote'],
  desc: 'Gets a random quote from an anime.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let body = await getQuotes(msg.content.startsWith(cfg.prefix.random))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
    }
    let rnd = Math.floor(Math.random() * body.length)
    msg.channel.send({
      embed: {
        color: 14267560,
        description: body[rnd].txt,
        footer: {
          text: body[rnd].name,
          icon_url: body[rnd].img
        }
      }
    })
  }
}

async function getQuotes (best) {
  let url = 'https://notify.moe/_/quotes/' + (best ? 'best/' : '') + 'from/' + (Math.random() * 150)
  let body = (await got(url)).body
  let $ = cheerio.load(body)
  let quotes = $('.quote')
  let res = []
  for (let i = 0; i < quotes.length; i++) {
    res.push({
      txt: $($(quotes[i]).find('blockquote')).text(),
      name: $(quotes[i]).find('img')[0].attribs.alt,
      img: 'https:' + $(quotes[i]).find('img')[0].attribs['data-src']
    })
  }
  return res
}
