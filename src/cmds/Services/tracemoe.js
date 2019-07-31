/* global cfg */
let got = require('got')

module.exports = {
  name: ['trace'],
  desc: 'Finds the anime of provided image.',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await traceImage(args.join(' '))
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (!body.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    msg.channel.send({
      embed: {
        title: body[mod].title + ' | Episode ' + body[mod].episode + ' @ ' + formatTime(body[mod].time * 1000),
        url: body[mod].url
      }
    })
    msg.channel.send(body[mod].vid)
  }
}

async function traceImage (input) {
  try {
    let img = await getBase64FromUrl(input)
    let url = 'https://trace.moe/api/search'
    let body = (await got(url, { body: { image: img }, json: true })).body
    let res = []
    for (let i = 0; i < body.docs.length; i++) {
      let item = body.docs[i]
      res.push({
        title: item.title_romaji,
        url: 'https://anilist.co/anime/' + item.anilist_id,
        time: item.at,
        episode: item.episode,
        vid: `https://media.trace.moe/video/${item.anilist_id}/${encodeURIComponent(item.filename)}?t=${item.at}&token=${item.tokenthumb}`,
        img: `https://trace.moe/thumbnail.php?anilist_id=${item.anilist_id}&file=${encodeURIComponent(item.filename)}&t=${item.at}&token=${item.tokenthumb}`
      })
    }
    return res
  } catch (e) { if (e) return null }
}

async function getBase64FromUrl (url) {
  let res = (await got(url, { encoding: null }))
  return 'data:' + res.headers['content-type'] + ';base64,' + Buffer.from(res.body).toString('base64')
}

function formatTime (ms) {
  let t = new Date(ms).toISOString().substr(11, 8).split(':')
  let h = Math.floor(ms / 1000 / 60 / 60).toString()
  if (h > 23) t[0] = h
  while (t.length > 2 && t[0] === '00' && t[1].startsWith('0')) {
    t.shift()
  }
  if (t.length > 2 && t[0] === '00') t.shift()
  if (t[0].startsWith('0')) t[0] = t[0].substr(1)
  return t.join(':')
}
