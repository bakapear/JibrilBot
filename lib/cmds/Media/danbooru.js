let { cfg } = global
let got = require('got')

module.exports = {
  name: ['danbooru', 'booru'],
  desc: 'otaku weeb normie command for special delivery inspired by special recipe',
  permission: '',
  usage: '(tags)',
  args: 0,
  command: async function (msg, cmd, args) {
    let body = await getPost(args, msg.content.startsWith(cfg.prefix.random))
    if (body.error) {
      msg.channel.send(body.error)
      return
    }
    if (!body || !body.length || !body[0]) {
      msg.channel.send('Nothing found!')
      return
    }
    let img = body[0].file_url
    let rating = body[0].rating
    if (rating === 's') rating = 'safe'
    if (rating === 'q') rating = 'questionable'
    if (rating === 'e') rating = 'explicit'
    msg.channel.send({ embed: { image: { url: img },
      footer: {
        text: rating
      } } })
  }
}

async function getPost (tags, rnd) {
  let url = 'https://danbooru.donmai.us/posts.json'
  let body = (await got(url, {
    query: {
      tags: tags.join(' '),
      limit: 100,
      random: rnd
    },
    json: true
  })).body
  if (body.success === false) {
    return { error: body.message }
  }
  body = body.filter(x => /* x.rating !== 'e' && */ !x.tag_string.includes('scat') && !x.tag_string.includes('guro') && !x.tag_string.includes('furry'))
  return body
}
