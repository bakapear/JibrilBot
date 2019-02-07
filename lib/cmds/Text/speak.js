let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['speak', 'spk'],
  desc: 'Speak like one of your fellow heroes.\nTypes: yoda, pirate, valspeak, minion, ferb-latin, pig-latin, dothraki, valyrian, sindarin, quenya, orcish, sith, cheunh, gungan, mandalorian, huttese,chef, catalan, shakespeare, vulcan, klingon, romulan, jive, dolan, fudd, kraut, smurf, wow, b1ff, cockney, norfolk, papertape, bcd, us2uk, leetspeak, brooklyn, upside_down, ermahgerd, circled-text, boston, austrian, lolcat, braille, binary, numbers, emoji, wingdings, aoler, hieroglyphics, babylonian',
  permission: '',
  usage: '<type> <message>',
  args: 2,
  command: async function (msg, cmd, args) {
    let res = await getText(args[0], args.slice(1).join(' '))
    if (!res) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (res.error) {
      msg.channel.send(res.error)
      return
    }
    msg.channel.send(res.text.substr(0, 1028))
  }
}

async function getText (type, message) {
  let url = 'https://funtranslations.com/' + type
  try {
    let body = (await got(url, {
      body: {
        text: message
      },
      form: true
    })).body
    let $ = cheerio.load(body)
    let res = $('.result-text')[0]
    if (res && res.children && res.children[0] && res.children[0].data) return { text: res.children[0].data }
    else return { error: "Couldn't find result of type!" }
  } catch (e) {
    if (e.statusCode === 404) return { error: 'Invalid speak type!' }
    else return { error: 'Something went wrong!' }
  }
}
