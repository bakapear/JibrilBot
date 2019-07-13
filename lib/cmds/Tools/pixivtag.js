let got = require('got')

module.exports = {
  name: ['pixtag', 'pixivtag'],
  desc: 'Gets legal tags from inputted tag for pixiv.',
  permission: '',
  usage: '<tag>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getTags(args.join(' '))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
    }
    let len = body.length
    if (len > 5) len = 5
    let txt = []
    for (let i = 0; i < len; i++) txt.push(body[i].tag_name)
    msg.channel.send(txt.join('\r\n'))
  }
}

async function getTags (input) {
  try {
    let url = 'https://www.pixiv.net/rpc/cps.php'
    let body = (await got(url, {
      query: {
        keyword: input
      },
      headers: {
        referer: 'https://www.pixiv.net/',
        'accept-language': 'en-US,en;q=0.9,de;q=0.8'
      },
      json: true
    })).body
    return body.candidates
  } catch (e) { if (e) return null }
}
