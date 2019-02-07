let got = require('got')

module.exports = {
  name: ['fox'],
  desc: 'Displays a random cute fox picture.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let url = 'https://randomfox.ca/floof'
    let body = (await got(url, { json: true })).body
    msg.channel.send({ embed: { image: { url: body.image } } })
  }
}
