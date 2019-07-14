let got = require('got')

module.exports = {
  name: ['cutegirl'],
  desc: 'Displays a radnom cutegirl for you.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let girl = await requestGirl()
    if (!girl) {
      msg.channel.send('No girl found!')
      return
    }
    msg.channel.send({
      embed: {
        title: girl.data.title,
        url: girl.data.link,
        image: { url: girl.data.image }
      }
    })
  }
}

async function requestGirl () {
  try {
    let url = 'http://api.cutegirls.moe/json'
    let body = (await got(url, { json: true })).body
    return body
  } catch (e) { if (e) return null }
}
