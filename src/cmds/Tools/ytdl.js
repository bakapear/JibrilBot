let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['ytdl'],
  desc: 'Get download links of a youtube video!',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getYTData(args.join(' '))
    if (!body) return msg.channel.send('Invalid URL!')
    let fields = []
    let urls = []
    let info = await getYTInfo(args.join(' '))
    for (let key in body) {
      for (let i = 0; i < body[key].length; i++) {
        urls.push(shortenURL(body[key][i].url))
      }
    }
    urls = await Promise.all(urls)
    for (let key in body) {
      let txt = ''
      for (let i = 0; i < body[key].length; i++) {
        txt += `[${body[key][i].ext}](${urls[i].url})\n`
      }
      fields.push({
        name: key,
        value: txt
      })
    }
    msg.channel.send({ embed: {
      title: `${info.title}`,
      url: args.join(' '),
      thumbnail: { url: info.thumbnail_url },
      fields: fields,
      color: 1283132
    } })
  }
}

async function getYTData (link) {
  try {
    let url = 'https://youtubemp4.to/download_ajax/'
    let { body } = await got.post(url, {
      body: { url: link },
      form: true,
      json: true
    })
    if (!body || body.error > 0) return null
    let $ = cheerio.load(body.result)
    let tr = $('tbody>tr')
    let res = {}
    for (let i = 0; i < tr.length; i++) {
      let type = $(tr[i]).parent().parent().prev()[0].children[0].data
      if (!res[type]) res[type] = []
      res[type].push({
        ext: $(tr[i]).find('td:nth-child(1)').text().trim(),
        url: $(tr[i]).find('td:nth-child(3)')[0].children[0].attribs.href
      })
    }
    return res
  } catch (e) { return null }
}

async function shortenURL (link) {
  try {
    let url = 'https://api.long.af/create'
    let { body } = await got.post(url, {
      body: {
        url: link,
        expires: 'never',
        type: null
      },
      json: true
    })
    return body
  } catch (e) { if (e) return null }
}

async function getYTInfo (link) {
  try {
    let url = 'https://www.youtube.com/oembed'
    let { body } = await got(url, {
      query: {
        format: 'json',
        url: link
      },
      json: true
    })
    return body
  } catch (e) { return null }
}
