let { cfg } = global
let got = require('got')
let apiStock = process.env.API_STOCK
let apiStockSecret = process.env.API_STOCK_SECRET

module.exports = {
  name: ['shutterstock', 'stock'],
  desc: 'Search for a shutterstock pictures, videos or audio.',
  permission: '',
  usage: '(audio/video) ; (query)',
  args: 0,
  command: async function (msg, cmd, args) {
    let method = ''
    if (args[1] === ';') {
      method = args[0]
      args.splice(0, 2)
    }
    let token = await getToken(apiStock, apiStockSecret)
    if (method === 'video') {
      let data = await getVideo(token, msg.content.slice(cmd.length + 1))
      if (!data) {
        msg.channel.send('Something went wrong!')
        return
      }
      if (data.length < 1) {
        msg.channel.send('Nothing found!')
        return
      }
      let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * data.length) : 0
      msg.channel.send(data[mod].assets.thumb_mp4.url)
      return
    }
    if (method === 'audio') {
      let data = await getAudio(token, msg.content.slice(cmd.length + 1))
      if (!data) {
        msg.channel.send('Something went wrong!')
        return
      }
      if (data.length < 1) {
        msg.channel.send('Nothing found!')
        return
      }
      let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * data.length) : 0
      msg.channel.send({ file: data[mod].assets.preview_ogg.url })
      return
    }
    let data = await getImage(token, msg.content.slice(cmd.length + 1))
    if (!data) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (data.length < 1) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * data.length) : 0
    let img = data[mod].assets.preview.url
    msg.channel.send({ embed: { image: { url: img } } })
  }
}

async function getToken (key, secret) {
  let url = 'https://api.shutterstock.com/v2/oauth/access_token'
  let body = (await got.post(url, {
    body: {
      client_id: key,
      client_secret: secret,
      grant_type: 'client_credentials'
    },
    form: true,
    json: true
  })).body
  return body.access_token
}

async function getImage (token, query) {
  let url = 'https://api.shutterstock.com/v2/images/search?sort=popular&view=minimal&query=' + encodeURIComponent(query).trim()
  try {
    let body = (await got(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    })).body
    return body.data
  } catch (e) { return false }
}

async function getVideo (token, query) {
  let url = 'https://api.shutterstock.com/v2/videos/search?sort=popular&view=minimal&query=' + encodeURIComponent(query).trim()
  try {
    let body = (await got(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    })).body
    return body.data
  } catch (e) { return false }
}

async function getAudio (token, query) {
  let url = 'https://api.shutterstock.com/v2/audio/search?view=minimal&query=' + encodeURIComponent(query).trim()
  try {
    let body = (await got(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    })).body
    return body.data
  } catch (e) { return false }
}
