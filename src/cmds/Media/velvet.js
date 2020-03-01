let fs = require('fs')
let path = require('path')
let data = JSON.parse(fs.readFileSync(path.join(__dirname, '/../', '/../', 'data', 'store', 'redvelvet.json'), { encoding: 'utf-8' }))
let rnd = x => x[Math.floor(Math.random() * x.length)]
let color = {
  irene: 12721750,
  wendy: 28856,
  seulgi: 15643153,
  joy: 3329330,
  yeri: 7090306
}

module.exports = {
  name: ['redvelvet', 'rv', 'irene', 'wendy', 'seulgi', 'joy', 'yeri'],
  desc: 'Retrieves your beloved red velvet bias.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let members = Object.keys(data)
    let member = members.includes(cmd) ? cmd : rnd(members)
    let img = rnd(data[member])
    if (!img) msg.channel.send(`'${member}' was not found.`)
    else msg.channel.send({ embed: { color: color[cmd], image: { url: img } } })
  }
}
