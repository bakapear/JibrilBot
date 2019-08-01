/* global bot */
let fs = require('fs')
let path = require('path')
let data = JSON.parse(fs.readFileSync(path.join(__dirname, '/../', '/../', 'data', 'store', 'wendy.json'), { encoding: 'utf-8' }))

module.exports = {
  name: ['wendy'],
  desc: 'Gets wendy. beel is excluded.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let user = bot.users.find(x => x.id === '284425943034888204')
    if (user) {
      if (user.id === msg.author.id) {
        msg.channel.send("O-oh I'm sorry but you aren't allowed to get wendy sources. You weeb! >:c")
        return
      } else if (user.presence.status === 'online') {
        msg.channel.send(`Oh noe! ${user.username} is online! You can't use the command right now!`)
        return
      }
    }
    let wen = await fetchRandomWen()
    if (wen.type === 'image') {
      msg.channel.send({ embed: {
        image: { url: wen.url }
      } })
    } else {
      msg.channel.send(wen.url)
    }
  }
}

async function fetchRandomWen () {
  let rnd = Math.floor(Math.random() * data.length)
  return data[rnd]
}
