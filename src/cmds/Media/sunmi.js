/* global bot */
let fs = require('fs')
let path = require('path')
let data = JSON.parse(fs.readFileSync(path.join(__dirname, '/../', '/../', 'data', 'store', 'sunmi.json'), { encoding: 'utf-8' }))

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
    let sun = await fetchRandomSun()
    if (sun.type === 'image') {
      msg.channel.send({ embed: {
        title: sun.caption,
        image: { url: sun.url }
      } })
    } else {
      msg.channel.send(`${sun.caption || ''}\n${sun.url}`)
    }
  }
}

async function fetchRandomSun () {
  let rnd = Math.floor(Math.random() * data.length)
  return data[rnd]
}
