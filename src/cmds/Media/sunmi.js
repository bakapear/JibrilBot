/* global bot */
let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['sunmi'],
  desc: 'Gets sunmi. Patrick is excluded.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let user = bot.users.find(x => x.id === '284425943034888204')
    if (user) {
      if (user.id === msg.author.id) {
        msg.channel.send("O-oh I'm sorry but you aren't allowed to get sunmi sources.")
        return
      } else if (user.presence.status === 'online') {
        msg.channel.send(`Oh noe! ${user.username} is online! You can't use the command right now!`)
        return
      }
    }
    return
    let data = await fetchSun()
  }
}

async function fetchSun () {
  let url = ''
  let { body } = await got(url)
  let $ = cheerio.load(body)
}
