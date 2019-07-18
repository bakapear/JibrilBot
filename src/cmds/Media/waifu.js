module.exports = {
  name: ['thiswaifudoesnotexist', 'waifu'],
  desc: 'Displays a random generated waifu picture.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let rnd = Math.floor(Math.random() * 20000)
    let img = `https://www.thiswaifudoesnotexist.net/example-${rnd}.jpg`
    msg.channel.send({ embed: { image: { url: img } } })
  }
}
