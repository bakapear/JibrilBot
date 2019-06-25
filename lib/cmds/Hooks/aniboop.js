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
      }
      if (store.id === body.user.id && store.type === type) {
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
        msg.channel.send(`You're currently booping with: ${store.name} (${store.type})`)
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
      let url = 'https://kitsu.io/api/edge/users/'
      let { body } = await got(url, {
        headers: { 'Accept': 'application/vnd.api+json' },
        query: { 'filter[query]': user }
      })
      body = JSON.parse(body)
      if (!body.data.length) return null
      body = body.data[0]
      url = 'https://kitsu.io/api/edge/library-entries'
      let anime = (await (got(url, {
        headers: { 'Accept': 'application/vnd.api+json' },
        query: {
          'filter[userId]': body.id,
          'filter[kind]': 'anime'
        }
      }))).body
      anime = JSON.parse(anime)
      let fetchId = async u => JSON.parse((await got(u, { headers: { 'Accept': 'application/vnd.api+json' } })).body).data.id
      anime = anime.data.map(async x => fetchId(x.relationships.anime.links.self))
      await Promise.all(anime).then(p => { anime = p })
      return {
        type: type,
        user: {
          id: body.id,
          name: body.attributes.name,
          avatar: body.attributes.avatar.large,
          url: body.links.self
        },
        anime: anime
      }
    }
  } catch (e) { if (e) return null }
}
