let got = require('got')
let apiImgur = process.env.API_IMGUR

module.exports = {
  name: ['imgur', 'ig'],
  desc: 'Uploads any picture to imgur and retrieves url with some data!',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    let url = 'https://api.imgur.com/3/image'
    let opts = {
      method: 'POST',
      headers: { 'Authorization': `Client-ID ${apiImgur}` },
      json: true,
      body: { image: args[0], type: 'url' }
    }
    let body = (await got(url, opts)).body
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
