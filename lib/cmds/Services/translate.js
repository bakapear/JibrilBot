let got = require('got')
let apiTranslate = process.env.API_TRANSLATE

module.exports = {
  name: ['translate', 'trans'],
  desc: 'Translates stuff to stuff.',
  permission: '',
  usage: '( (2) source lang code) ( (1) target lang code) ; <text>',
  args: 1,
  command: async function (msg, cmd, args) {
    let source = null
    let target = 'en'
    let text = args.join(' ')
    if (text.indexOf(';') >= 0) {
      let part = text.split(';')[0].trim().split(' ')
      text = text.split(';')[1].trim()
      if (part.length >= 2) {
        source = part[0]
        target = part[1]
      } else if (part.length === 1) {
        target = part[0]
      }
    }
    let lang = source ? (source + '-' + target) : target
    console.log(lang)
    let body = await translate(lang, text)
    if (!body || body.code !== 200) {
      msg.channel.send('Something went wrong!')
      return
    }
    msg.channel.send({ embed: {
      title: 'From ' + body.lang.toUpperCase().split('-')[0] + ' to ' + body.lang.toUpperCase().split('-')[1],
      description: body.text[0],
      color: 12382333
    } })
  }
}

async function translate (language, text) {
  try {
    let url = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
    let body = (await got(url, {
      query: {
        key: apiTranslate,
        text: text,
        lang: language
      },
      json: true
    })).body
    return body
  } catch (e) { if (e) return null }
}
