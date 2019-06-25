let got = require('got')
let bin = require('jsonbin.org')('token ' + process.env.API_JSONBIN)

module.exports = {
  name: ['boop', 'aniboop', 'malboop', 'kitboop'],
  desc: 'Boops you if user\'s animes pop up in the #anime channel.',
  permission: '',
  usage: '(user)',
  args: 0,
  guilds: ['311614665774071808'],
  command: async function (msg, cmd, args) {
    let path = 'jibril/' + msg.guild.id + '/cmds/aniboop/' + msg.author.id + '/'
    let store = await bin.get(path)
    if (!store) store = await bin.post(path, {})
    if (args[0] && cmd !== 'boop') {
      let type = null
      switch (cmd) {
        case 'aniboop':
          type = 'AniList'
          break
        case 'malboop':
          type = 'MyAnimeList'
          break
        case 'kitboop':
          type = 'Kitsu'
          break
      }
      let body = await fetchAnimeUser(type, args[0])
      if (!body) {
        msg.channel.send('User not found!')
        return
      }
      if (store.id === body.user.id) {
        await bin.post(path, {})
        msg.channel.send({
          embed: {
            title: `Debooping from ${body.user.name}! (${body.type})`,
            url: body.user.url,
            description: `Removed ${body.anime.length} animes...`,
            thumbnail: {
              url: body.user.avatar.large
            }
          }
        })
      } else {
        store = { id: body.user.id, name: body.user.name, type: body.type }
        await bin.post(path, store)
        msg.channel.send({
          embed: {
            title: `Booping with ${body.user.name}! (${body.type})`,
            url: body.user.url,
            description: `Added ${body.anime.length} animes!`,
            thumbnail: {
              url: body.user.avatar
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
  },
  fetch: fetchAnimeUser
}

async function fetchAnimeUser (type, user) {
  try {
    if (type === 'AniList') {
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
      body = body.data.MediaListCollection
      let anime = []
      for (let i = 0; i < body.lists.length; i++) {
        for (let j = 0; j < body.lists[i].entries.length; j++) {
          anime.push(body.lists[i].entries[j].mediaId)
        }
      }
      return {
        type: type,
        user: {
          id: body.user.id,
          name: body.user.name,
          avatar: body.user.avatar.large,
          url: body.user.siteUrl
        },
        anime: anime
      }
    } else if (type === 'MyAnimeList') {
      let url = 'https://api.jikan.moe/v3/user/' + user
      let { body } = await got(url, { json: true })
      if (!body || body.status === 404) return null
      url += '/animelist/all'
      let anime = (await (got(url, { json: true }))).body
      anime = anime.anime.map(x => x.mal_id)
      return {
        type: type,
        user: {
          id: body.username,
          name: body.username,
          avatar: body.image_url,
          url: body.url
        },
        anime: anime
      }
    } else if (type === 'Kitsu') {
      return null
    }
  } catch (e) { if (e) return null }
}
