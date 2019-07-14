let got = require('got')

module.exports = {
  name: ['cat'],
  desc: 'Displays a random cute cat picture.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let body = await fetchCat()
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    msg.channel.send({ embed: { image: { url: body.file } } })
  }
}

async function fetchCat () {
  try {
    let url = 'http://aws.random.cat/meow.php'
    let body = (await got(url, { json: true })).body
    return body
  } catch (e) { if (e) return null }
}
