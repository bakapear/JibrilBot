let got = require('got')
let bin = require('jsonbin.org')('token ' + process.env.API_JSONBIN)

module.exports = {
  name: ['boop'],
  desc: 'Boops you if user\'s animes pops up in the #anime channel.',
  permission: '',
  usage: '(user)',
  args: 0,
  guilds: ['311614665774071808'],
  command: async function (msg, cmd, args) {
    let path = 'jibril/' + msg.guild.id + '/cmds/aniboop/' + msg.author.id + '/'
    let store = await bin.get(path)
    if (!store) store = await bin.post(path, {})
    if (args[0]) {
      let body = await getStuff(args[0])
      if (!body) {
        msg.channel.send('User not found!')
        return
      }
      body = body.data.MediaListCollection
      let anime = []
      for (let i = 0; i < body.lists.length; i++) {
        for (let j = 0; j < body.lists[i].entries.length; j++) {
          anime.push(body.lists[i].entries[j].mediaId)
        }
      }
      if (store.id === body.user.id) {
        await bin.post(path, {})
        msg.channel.send({
          embed: {
            title: `Debooping from ${body.user.name}! (AniList)`,
            url: body.user.siteUrl,
            description: `Removed ${anime.length} animes...`,
            thumbnail: {
              url: body.user.avatar.large
            }
          }
        })
      } else {
        store = { id: body.user.id, name: body.user.name, type: 'anilist', anime: anime }
        await bin.post(path, store)
        msg.channel.send({
          embed: {
            title: `Booping with ${body.user.name}! (AniList)`,
            url: body.user.siteUrl,
            description: `Added ${anime.length} animes!`,
            thumbnail: {
              url: body.user.avatar.large
            }
          }
        })
      }
    } else {
      if (store.id) {
        msg.channel.send("You're currently booping with: " + store.name)
      } else {
        msg.channel.send("You're not booping with anyone today!")
      }
    }
  }
}

async function getStuff (user) {
  try {
    let variables = { 'userName': user, 'type': 'ANIME' }
    let query = 'query ($userId: Int, $userName: String, $type: MediaType) { MediaListCollection(userId: $userId, userName: $userName, type: $type) { lists { name entries { mediaId } } user { id name avatar { large } siteUrl } } }'
    let url = 'https://graphql.anilist.co'
    let { body } = await got(url, {
      body: {
        query: query,
        variables: variables
      },
      json: true
    })
    return body
  } catch (e) { if (e) return null }
}
