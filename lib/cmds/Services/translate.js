let got = require('got')
let apiTranslate = process.env.API_TRANSLATE

module.exports = {
  name: ['translate', 'trans'],
  desc: 'Translates stuff to stuff.',
  permission: '',
  usage: '(target language) ; <text>',
  args: 1,
  command: async function (msg, cmd, args) {
    let target = 'en'
    let text = args.join(' ')
    if (text.indexOf(';') >= 0) {
      target = text.split(';')[0]
    }
    let body = await translate(target, text)
    if (!body || body.code !== 200) {
      msg.channel.send('Something went wrong!')
      return
    }
    msg.channel.send({ embed: {
      title: body.lang.toUpperCase() + ' to ' + target.toUpperCase(),
      description: body.text[0],
      color: 12382333
    } })
  }
}

async function translate (target, text) {
  try {
    let url = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
    let body = (await got(url, {
      query: {
        key: apiTranslate,
        text: text,
        lang: target
      },
      json: true
    })).body
    return body
  } catch (e) { if (e) return null }
}
