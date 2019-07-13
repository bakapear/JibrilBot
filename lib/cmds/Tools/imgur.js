let got = require('got')
let apiImgur = process.env.API_IMGUR

module.exports = {
  name: ['imgur', 'ig'],
  desc: 'Uploads any picture to imgur and retrieves url with some data!',
  permission: '',
  usage: '<image url>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getImageUrl(args[0])
    if (body.error) {
      msg.channel.send(body.error)
      return
    }
    msg.channel.send({
      embed: {
        color: 9094948,
        title: body.data.link,
        url: body.data.link,
        description: `**Resolution** ${body.data.width}x${body.data.height}\n**Size** ${body.data.size / 1000}KB\n**Type** ${body.data.type}`,
        thumbnail: {
          url: body.data.link
        }
      }
    })
  }
}

async function getImageUrl (img) {
  try {
    let url = 'https://api.imgur.com/3/image'
    let opts = {
      method: 'POST',
      headers: { Authorization: `Client-ID ${apiImgur}` },
      json: true,
      body: { image: img, type: 'url' }
    }
    let body = (await got(url, opts)).body
    return body
  } catch (e) { if (e) return { error: e.response.body.data.error } }
}
