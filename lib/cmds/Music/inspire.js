let got = require('got')

module.exports = {
  name: ['inspire'],
  desc: 'Inspire yourself.',
  permission: [],
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let Player = global.getPlayer(msg)
    if (!Player) {
      msg.channel.send("You're not in a voice channel!")
      return
    }
    let sound = await generateInspiroFlow()
    let item = await Player.play(sound, msg.author)
    if (!item) msg.channel.send('Nothing found!')
    else if (item.error) msg.channel.send(item.error)
    else if (Player.active) Player.msgQueued(msg, item)
  }
}

async function generateInspiroFlow () {
  try {
    let url = 'https://inspirobot.me/api?generateFlow=1'
    let body = (await got(url, { json: true })).body
    return {
      type: 'url',
      url: body.mp3,
      title: body.data[1].text
    }
  } catch (e) { if (e) return null }
}
