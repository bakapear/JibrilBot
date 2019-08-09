let crypto = require('crypto')
let got = require('got')

module.exports = {
  name: ['ytmp3', 'ytmp4'],
  desc: 'Convert youtube videos into mp3/mp4!',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getVideo(args.join(' '), cmd)
    if (!body) return msg.channel.send('Invalid URL!')
    msg.channel.send({ embed: {
      title: 'Download ' + cmd.replace('yt', '').toUpperCase(),
      url: body.url,
      description: body.title,
      thumbnail: { url: body.img }
    } })
  }
}

async function getVideo (query, type) {
  try {
    let info = await getInfo(query)
    if (!info) return { error: 'Invalid URL!' }
    let url = 'https://ddownr.com/download.php'
    let { body } = await got(url, {
      query: {
        url: query,
        'format-option': type === 'ytmp4' ? 6 : 1,
        playlist: 1,
        playliststart: 1,
        playlistend: 25,
        index: 1,
        rkey: null,
        subtitles: 0,
        naming: 1,
        email: null,
        server_eu: 1,
        server_us: 1
      },
      json: true
    })
    let res = body
    if (res.success) {
      let { body } = await got(res.progress_url, { json: true })
      if (body.download_url) {
        return {
          title: info.title,
          img: info.image,
          url: body.download_url
        }
      }
    }
  } catch (e) { return null }
}

async function getInfo (query) {
  try {
    let url = 'https://ddownr.com/api/info/index.php'
    let { body } = await got(url, { query: { url: query }, json: true })
    return body.title === query ? null : body
  } catch (e) { return null }
}
