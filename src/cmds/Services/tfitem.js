/* global cfg */
let got = require('got')

module.exports = {
  name: ['tfitem'],
  desc: 'Get info about a TF2 item',
  permission: '',
  usage: '(id/name)',
  args: 0,
  command: async function (msg, cmd, args) {
    try {
      let items = await getItems(args.join(' ').trim(), msg.content.startsWith(cfg.prefix.random))
      if (!items) return msg.channel.send('Something went wrong!')
      if (!items.length) return msg.channel.send('Nothing found!')
      let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * items.length) : 0
      if (args.join(' ').trim() === '') mod = Math.floor(Math.random() * items.length)
      let item = items[mod]
      let attribs = []
      if (item.attributes) {
        if (item.attributes.unusual) attribs.push({ name: 'Unusual Attribs', value: item.attributes.unusual.join('\n') })
        if (item.attributes.neutral) attribs.push({ name: 'Neutral Attribs', value: item.attributes.neutral.join('\n') })
        if (item.attributes.positive) attribs.push({ name: 'Positive Attribs', value: item.attributes.positive.join('\n') })
        if (item.attributes.negative) attribs.push({ name: 'Negative Attribs', value: item.attributes.negative.join('\n') })
      }
      let desc = item.desc.replace(/\\n/g, '\n')
      msg.channel.send({
        embed: {
          title: item.name,
          description: item.level + '\n\n' + desc,
          thumbnail: { url: item.img },
          fields: attribs
        }
      })
    } catch (e) {
      msg.channel.send("Something went wrong! Don't trust purr.now.sh! It's bad. Very bad.")
    }
  }
}

async function getItems (query, rnd) {
  try {
    if (!query) {
      if (rnd) query = 'type!=medal'
      else query = '*'
    }
    let url = 'https://purr.now.sh/tfitems/items'
    let { body } = await got(url, { query: { q: query }, json: true })
    return body
  } catch (e) { return null }
}
