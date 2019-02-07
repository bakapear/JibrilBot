let got = require('got')

module.exports = {
  name: ['tfitem'],
  desc: 'Get info about a TF2 item',
  permission: '',
  usage: '(id/name)',
  args: 0,
  command: async function (msg, cmd, args) {
    try {
      let items = await getItems(args.join(' ').trim(), msg.content.startsWith('-'))
      if (items === -1) {
        msg.channel.send('Please enter a name with at least 3 characters or more.')
        return
      }
      if (!items.count) {
        msg.channel.send('Nothing found!')
        return
      }
      let mod = msg.content.startsWith('.') ? Math.floor(Math.random() * items.matches.length) : 0
      if (args.join(' ').trim() === '') mod = Math.floor(Math.random() * items.matches.length)
      let item = items.matches[mod]
      let attribs = []
      if (item.attribs) {
        if (item.attribs.neutral) attribs.push({ name: 'Neutral Attribs', value: item.attribs.neutral.join('\n') })
        if (item.attribs.positive) attribs.push({ name: 'Positive Attribs', value: item.attribs.positive.join('\n') })
        if (item.attribs.negative) attribs.push({ name: 'Negative Attribs', value: item.attribs.negative.join('\n') })
      }
      let desc = item.desc.replace(/\\n/g, '\n')
      msg.channel.send({
        embed: {
          title: item.name,
          description: item.level + '\n\n' + desc,
          thumbnail: {
            url: item.img
          },
          fields: attribs
        }
      })
    } catch (e) {
      msg.channel.send("Something went wrong! Don't trust purr.now.sh! It's bad. Very bad.")
    }
  }
}

async function getItems (query, weps) {
  let search = query
  if (!query) search = ''
  else if (isNaN(query) && query.length < 3) return -1
  let opts = { q: search }
  if (weps && query === '') opts.weps = 1
  let url = 'https://purr.now.sh/tfitems/search'
  let body = (await got(url, { query: opts, json: true })).body
  return body
}
