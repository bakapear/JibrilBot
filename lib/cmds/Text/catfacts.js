let got = require('got')

module.exports = {
  name: ['catfact', 'catfacts'],
  desc: 'Be the one to drop a cat fact!',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let url = 'https://cat-fact.herokuapp.com/facts/random'
    let { body } = await got(url, { json: true })
    msg.channel.send(body.text)
  }
}
