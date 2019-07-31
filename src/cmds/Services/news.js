/* global cfg */
let got = require('got')
let apiNews = process.env.API_NEWS

module.exports = {
  name: ['news'],
  desc: 'Gets the latest news for given country.',
  permission: '',
  usage: '<country>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getHeadlines(args[0])
    if (!body.totalResults) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.articles.length) : 0
    body = body.articles[mod]
    let footer = body.publishedAt
    if (body.author) footer = body.author + ' @ ' + body.publishedAt
    msg.channel.send({
      embed: {
        title: body.title,
        url: body.url,
        description: body.description,
        color: 4598015,
        image: {
          url: body.urlToImage
        },
        footer: {
          text: footer
        }
      }
    })
  }
}

async function getHeadlines (country) {
  let url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiNews}`
  let body = (await got(url, { json: true })).body
  return body
}
