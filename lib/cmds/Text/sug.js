let { cfg } = global
let got = require('got')

module.exports = {
  name: ['sug'],
  desc: 'Tries to autocomplete a word you typed.',
  permission: '',
  usage: '<word>',
  args: 1,
  command: async function (msg, cmd, args) {
    let url = 'https://api.datamuse.com/sug?v=enwiki&s=' + encodeURIComponent(msg.content.slice(cmd.length + 1).trim())
    let body = (await got(url, { json: true })).body
    if (body.length < 1) {
      msg.channel.send('Nothing found!')
      return
    }
    let wordlist = ''
    let len = body.length < 5 ? body.length : 5
    if (msg.content.startsWith(cfg.prefix.first)) len = 1
    for (let i = 0; i < len; i++) {
      wordlist += body[i].word + '\n'
    }
    msg.channel.send(wordlist)
  }
}
