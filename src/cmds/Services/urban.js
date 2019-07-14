let { cfg } = global
let got = require('got')

module.exports = {
  name: ['urb', 'urban'],
  desc: 'The Urban Dictionary that gives you information about some words.',
  permission: '',
  usage: '<word>',
  args: 1,
  command: async function (msg, cmd, args) {
    let url = `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`
    let body = (await got(url, { json: true })).body
    if (body.list.length < 1) {
      msg.channel.send('Nothing found!')
      return
    }
    if (!body.list[0]) {
      msg.channel.send('No information about that!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.list.length) : 0
    msg.channel.send({
      embed: {
        color: 16777060,
        title: body.list[mod].word,
        url: body.list[mod].permalink,
        fields: [{
          name: 'Definition',
          value: `${body.list[mod].definition.substring(0, 1020)}...`
        },
        {
          name: 'Example',
          value: body.list[mod].example
        }],
        footer: {
          text: `by ${body.list[mod].author}`
        }
      }
    })
  }
}
