/* global cfg */

let uses = 10
setInterval(() => {
  if (uses < 10) uses++
}, 3600000)

module.exports = {
  disabled: false,
  type: 'msg',
  check: async msg => {
    if (startsWithPrefix(msg.content) &&
    msg.content.toLowerCase().indexOf('wendy') &&
    msg.author.id === '284425943034888204') {
      if (uses <= 0) {
        msg.reply('You are out of wendy uses!')
        return true
      }
      msg.reply(`Uses left: ${--uses}/10`)
    }
    return false
  }
}

function startsWithPrefix (text) {
  let prefixes = Object.keys(cfg.prefix).map(x => cfg.prefix[x])
  let pass = false
  for (let i = 0; i < prefixes.length; i++) {
    if (text.startsWith(prefixes[i])) pass = true
  }
  return pass
}
