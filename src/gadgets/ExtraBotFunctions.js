/* global bot, cfg */
let got = require('got')

module.exports = {
  disabled: false,
  type: 'bot',
  check: async bot => {
    //cfg.avatars = await getAvatars()
    setInterval(rndPresence, 654321)
    //setInterval(rndAvatar, 654321)
  }
}

async function getAvatars () {
  try {
    let url = 'https://raw.githubusercontent.com/bakapear/osuavatars/master/data.json'
    let body = (await got(url, { json: true })).body
    return body.items.map(x => body.url + x)
  } catch (e) { if (e) return null }
}
async function rndPresence () {
  try {
    let url = 'http://api.urbandictionary.com/v0/random'
    let word = (await got(url, { json: true })).body.list[0].word
    if (word) bot.user.setPresence({ game: { name: word.substring(0, 25), type: Math.floor(Math.random() * 4) } })
  } catch (e) { if (e) return null }
}
function rndAvatar () {
  if (!cfg.avatars) return
  let rnd = Math.floor(Math.random() * cfg.avatars.length)
  let img = cfg.avatars[rnd]
  checkImage(img).then(res => {
    if (res === true) {
      bot.user.setAvatar(img)
      cfg.img = img
    } else {
      cfg.avatars.splice(rnd, 1)
      rndAvatar()
    }
  })
}
async function checkImage (url) {
  try {
    let { headers } = await got(url)
    return headers['content-type'].indexOf('image') >= 0
  } catch (e) { if (e) return false }
}
