let got = require('got')

module.exports = {
  name: ['translate', 'trans'],
  desc: 'Translates stuff to stuff.',
  permission: '',
  usage: '( (2) source lang code) ( (1) target lang code) ; <text>',
  args: 1,
  command: async function (msg, cmd, args) {
    let source = 'auto'
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
    let body = await translate(source, target, text)
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    msg.channel.send({ embed: {
      title: 'From ' + body.lang.from + ' to ' + body.lang.to,
      description: body.translated,
      color: 12382333
    } })
  }
}

async function translate (source, target, text) {
  try {
    let url = 'https://translate.googleapis.com/translate_a/single'
    let body = (await got(url, {
      query: {
        client: 'gtx',
        sl: source,
        tl: target,
        hl: target,
        dt: 't',
        ie: 'UTF-8',
        oe: 'UTF-8',
        otf: 1,
        ssel: 0,
        tsel: 0,
        kc: 7,
        q: text
      }
    })).body
    body = JSON.parse(body)
    let output = []
    for (let i = 0; i < body[0].length; i++) output.push(body[0][i][0])
    let res = {
      input: text,
      translated: output.join('\r\n'),
      lang: {
        from: body[8][0][0].toUpperCase(),
        to: target.toUpperCase()
      }
    }
    return res
  } catch (e) { if (e) return null }
}
