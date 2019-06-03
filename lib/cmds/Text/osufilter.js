let fs = require('fs')
let path = require('path')

module.exports = {
  name: ['osf', 'osuchat', 'osufilter', 'osuchatfilter'],
  desc: 'Format your text with osu! censors o3o',
  permission: '',
  usage: '<text>',
  args: 1,
  command: async function (msg, cmd, args) {
    let txt = args.join(' ')
    txt = applyFilter(txt)
    msg.channel.send(txt)
  }
}

let filter = JSON.parse(fs.readFileSync(path.join(__dirname, '/../', '/../', 'data', 'store', 'osuchatfilter.json'), { encoding: 'utf-8' }))
filter.replacements = filter.replacements.reverse()

function applyFilter (text) {
  for (let prop in filter.replacements) {
    let regex = new RegExp(prop, 'g')
    text = text.replace(regex, filter.replacements[prop])
  }
  return text
}
