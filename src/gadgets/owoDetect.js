let got = require('got')

async function respond (msg, type) {
  let url = 'https://api.lolis.life/' + (type === 'owo' ? 'kawaii' : 'pat')
  let { body } = await got(url, { json: true })
  msg.reply({ embed: { image: { url: body.url } } })
}

module.exports = {
  disabled: false,
  type: 'msg',
  check: async msg => {
    if (msg.author.bot) return false
    let txt = msg.content.toLowerCase()
    if (txt.indexOf('owo') >= 0) respond(msg, 'owo')
    else if (txt.indexOf('uwu') >= 0) respond(msg, 'uwu')
    return false
  }
}
