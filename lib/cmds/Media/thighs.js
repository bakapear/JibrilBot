// for beel :3
let got = require('got')

module.exports = {
  name: ['thighs', 'thighsthatrequiremuchworktoget'],
  desc: 'Gets random thighs for beel.',
  permission: '',
  usage: '',
  args: 0,
  command: async function (msg, cmd, args) {
    let thighs = await getRedditThighs()
    if (!thighs.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith('.') ? Math.floor(Math.random() * thighs.length) : 0
    msg.channel.send({
      embed: {
        title: thighs[mod].title,
        image: {
          url: thighs[mod].url
        }
      }
    })
  }
}
async function getRedditThighs () {
  let chicken = []
  let url = 'https://api.reddit.com/r/thighs'
  let next = ''
  do {
    let body = (await got(url, {
      query: {
        'restrict_sr': true,
        'limit': 100,
        'after': next
      },
      json: true
    })).body.data
    for (let i = 0; i < body.children.length; i++) {
      if (body.children[i].data.post_hint === 'image') {
        chicken.push({
          title: body.children[i].data.title,
          url: body.children[i].data.url
        })
      }
    }
    next = body.after
    if (chicken.length >= 200) next = null
  } while (next)
  return chicken
}
