let got = require('got')

module.exports = {
  name: ['taunt'],
  desc: 'Says a random game taunt.',
  permission: '',
  usage: '(polite|funny|rude)',
  args: 0,
  command: async function (msg, cmd, args) {
    let mode = 'polite'
    if (args[0]) {
      switch (args[0]) {
        case 'polite': {
          mode = 'polite'
          break
        }
        case 'funny': {
          mode = 'funny'
          break
        }
        case 'rude': {
          mode = 'rude'
          break
        }
        default: {
          msg.channel.send('Invalid type!')
          return
        }
      }
    }
    let url = `http://api.genr8rs.com/Generator/Gaming/Fun/GameTauntGenerator?_sInsultLevel=${mode}`
    let body = (await got(url, { json: true })).body
    msg.channel.send(body._sResult)
  }
}
