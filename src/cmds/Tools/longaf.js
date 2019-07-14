let got = require('got')

module.exports = {
  name: ['laf', 'longaf'],
  desc: 'Shortens an url.',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await shortenURL(args[0])
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    msg.channel.send(body.url)
  }
}

async function shortenURL (link) {
  try {
    let url = 'https://api.long.af/create'
    let body = (await got.post(url, {
      body: {
        url: link,
        expires: null,
        type: null
      },
      json: true
    })).body
    return body
  } catch (e) { if (e) return null }
}
