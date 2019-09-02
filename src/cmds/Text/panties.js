let got = require('got')

module.exports = {
  name: ['panties'],
  desc: 'Weird command tbh.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let comments = await getComments()
    let rnd = Math.floor(Math.random() * comments.length)
    msg.channel.send(comments[rnd])
  }
}

async function getComments () {
  let url = 'https://gelbooru.com/index.php?page=dapi&s=comment&q=index'
  let { body } = await got(url)
  return body.match(/body=".*?"/g).map(x => x.substring(6, x.length - 1))
}
