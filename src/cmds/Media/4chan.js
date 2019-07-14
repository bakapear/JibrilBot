let { cfg } = global
let got = require('got')

module.exports = {
  name: ['4chan'],
  desc: 'Gets a random 4chan post from a specific board.',
  permission: '',
  usage: '<board>',
  args: 1,
  command: async function (msg, cmd, args) {
    let data = await getRandom4ChanPost(args[0], msg)
    if (data === -1) {
      msg.channel.send('Invalid board!')
      return
    }
    if (data === -2) {
      msg.channel.send('Nothing found?!')
      return
    }
    let dots = data.comment.length > 300 ? '...' : ''
    msg.channel.send({
      embed: {
        title: '>>' + data.thread,
        description: decodeHtml(data.comment.replace(/<(?:.|\n)*?>/gm, '')).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').substring(0, 300) + dots,
        image: {
          url: data.image
        },
        footer: {
          text: data.time
        }
      }
    })
  }
}

async function getRandom4ChanPost (board, msg) {
  let posts = []
  for (let index = 1; index <= 3; index++) {
    let url = `https://a.4cdn.org/${board}/${index}.json`
    try {
      let body = (await got(url, { json: true })).body
      for (let i = 0; i < body.threads.length; i++) {
        for (let j = 0; j < body.threads[i].posts.length; j++) {
          if (body.threads[i].posts[j].images > 1) posts.push(body.threads[i].posts[j])
        }
      }
    } catch (e) { return -1 }
  }
  if (!posts) return -2
  let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * posts.length) : 0
  let url = `https://a.4cdn.org/${board}/thread/${posts[mod].no}.json`
  let body = (await got(url, { json: true })).body
  let data = []
  for (let i = 1; i < body.posts.length; i++) {
    if (body.posts[i].ext) data.push(body.posts[i])
  }
  mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * data.length) : 0
  return {
    image: `https://i.4cdn.org/${board}/${data[mod].tim}${data[mod].ext}`,
    comment: data[mod].com || '',
    thread: data[mod].no || '',
    time: data[mod].now
  }
}

function decodeHtml (str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec)
  })
}
