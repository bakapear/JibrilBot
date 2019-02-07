let got = require('got')

module.exports = {
  name: ['yes', 'no', 'maybe'],
  desc: 'Displays a random yes/no/maybe gif.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let url = 'https://yesno.wtf/api?force=' + cmd
    let body = (await got(url, { json: true })).body
    msg.channel.send({ embed: { image: { url: body.image } } })
  }
}
