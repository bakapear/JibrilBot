let fetchAnimeUser = require('../cmds/Hooks/aniboop.js').fetch
let bin = require('jsonbin.org')('token ' + process.env.API_JSONBIN)

async function boopChat (msg) {
  if (msg.embeds[0]) {
    let txt = msg.embeds[0].description
    let alts = {
      AniList: [].concat(/\(https:\/\/anilist.co\/anime\/(.*?)\)/g.exec(txt))[1],
      MyAnimeList: [].concat(/\(https:\/\/myanimelist.net\/anime\/(.*?)\)/g.exec(txt))[1],
      Kitsu: [].concat(/\(https:\/\/kitsu.io\/anime\/(.*?)\)/g.exec(txt))[1]
    }
    let path = 'jibril/' + msg.guild.id + '/cmds/aniboop/'
    let store = await bin.get(path)
    let users = []
    for (let user in store) {
      if (!store[user] || !store[user].id) continue
      let type = store[user].type
      let id = parseInt(alts[type])
      if (!id) continue
      let girl = await fetchAnimeUser(type, store[user].id)
      if (!girl) continue
      if (girl.anime.includes(id)) {
        users.push(`<@${user}>`)
      }
    }
    if (users.length) {
      msg.channel.send(users.join(' '))
    }
  }
}

module.exports = {
  disabled: true,
  type: 'msg',
  check: async msg => {
    if (msg.channel.id === '589431935017680916') {
      await boopChat(msg)
      return true
    }
    return false
  }
}
