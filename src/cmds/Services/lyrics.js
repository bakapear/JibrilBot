let { cfg } = global
let got = require('got')
let cheerio = require('cheerio')
let apiGenius = process.env.API_GENIUS

module.exports = {
  name: ['lyrics'],
  desc: 'Get the lyrics of a song',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await searchGenius(args.join(' '))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    let lyrics = await getLyricsFromLink(body[mod].result.url)
    if (lyrics.length > 1996) lyrics = lyrics.substr(0, 1996) + '...'
    msg.channel.send({
      embed: {
        title: body[mod].result.title,
        description: lyrics,
        thumbnail: {
          url: body[mod].result.song_art_image_thumbnail_url
        }
      }
    })
  }
}

async function searchGenius (query) {
  try {
    let url = 'https://api.genius.com/search'
    let body = (await got(url, {
      json: true,
      headers: {

        Authorization: 'Bearer ' + apiGenius
      },
      query: {
        q: query
      }
    })).body
    if (body.response && body.response.hits) {
      return body.response.hits
    } else {
      return null
    }
  } catch (e) { if (e) return null }
}

async function getLyricsFromLink (link) {
  let body = (await got(link)).body
  let $ = cheerio.load(body)
  let res = $('.lyrics p').text()
  return res
}
