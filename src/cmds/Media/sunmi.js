/* global bot */
let fs = require('fs')
let path = require('path')
let data = JSON.parse(fs.readFileSync(path.join(__dirname, '/../', '/../', 'data', 'store', 'sunmi.json'), { encoding: 'utf-8' }))

module.exports = {
  name: ['sunmi'],
  desc: 'Gets sunmi. mkk is excluded.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let user = bot.users.find(x => x.id === '77111818492846080')
    if (user) {
      if (user.id === msg.author.id) {
        msg.channel.send("O-oh I'm sorry but you aren't allowed to get sunmi sources. You weeb! >:c")
        return
      } else if (user.presence.status === 'online') {
        msg.channel.send(`Oh noe! ${user.username} is online! You can't use the command right now!`)
        return
      }
    }
    let sun = await fetchRandomSun()
    if (sun.type === 'image') {
      msg.channel.send({ embed: {
        image: { url: sun.url }
      } })
    } else {
      msg.channel.send(sun.url)
    }
  }
}

async function fetchRandomSun () {
  let rnd = Math.floor(Math.random() * data.length)
  return data[rnd]
}
