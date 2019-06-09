let { cfg } = global
let got = require('got')
let apiGoogle = process.env.API_GOOGLE

module.exports = {
  name: ['youtube', 'yt', 'playlist', 'ytpl'],
  desc: 'Finds a youtube video (or gets list of results if with random prefix)',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let type = 'video'
    if (cmd === 'playlist' || cmd === 'ytpl') type = 'playlist'
    let items = await getItems(type, args.join(' '))
    if (!items) {
      msg.channel.send('Nothing found!')
      return
    }
    if (msg.content.startsWith(cfg.prefix.random)) {
      let message = []
      for (let i = 0; i < items.length; i++) {
        message.push(`${i + 1}. [${items[i].name}](${items[i].url}) [${items[i].size}]`)
      }
      msg.channel.send({
        embed: {
          color: 14506163,
          title: 'Search Results',
          description: message.join('\n')
        }
      })
    } else {
      msg.channel.send(items[0].url)
    }
  }
}

async function getItems (type, query) {
  let url = 'https://www.googleapis.com/youtube/v3/search'
  let body = (await got(url, {
    query: {
      q: query,
      part: 'snippet',
      type: type,
      key: apiGoogle
    },
    json: true
  })).body
  if (!body.items.length) return
  let items = []
  let ids = []
  for (let i = 0; i < body.items.length; i++) {
    let id = body.items[i].id.videoId || body.items[i].id.playlistId
    ids.push(id)
    items.push({
      name: body.items[i].snippet.title,
      url: (type === 'video' ? 'https://youtube.com/watch?v=' : 'https://youtube.com/playlist?list=') + id
    })
  }
  let times = type === 'video' ? await getDurations(ids) : await getPlaylistLengths(ids)
  for (let i = 0; i < items.length; i++) {
    items[i].size = times[i]
  }
  return items
}

async function getPlaylistLengths (ids) {
  let url = 'https://www.googleapis.com/youtube/v3/playlists'
  let body = (await got(url, {
    query: {
      id: ids.join(','),
      part: 'contentDetails',
      key: apiGoogle
    },
    json: true
  })).body
  let times = []
  for (let i = 0; i < body.items.length; i++) {
    times.push(body.items[i].contentDetails.itemCount + ' Videos')
  }
  return times
}

async function getDurations (ids) {
  let url = 'https://www.googleapis.com/youtube/v3/videos'
  let body = (await got(url, {
    query: {
      id: ids.join(','),
      part: 'contentDetails',
      key: apiGoogle
    },
    json: true
  })).body
  let times = []
  for (let i = 0; i < body.items.length; i++) {
    times.push(formatYTTime(body.items[i].contentDetails.duration))
  }
  return times
}

function formatYTTime (duration) {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  match = match.slice(1).map(x => x ? x.replace(/\D/, '') : x)
  let hours = (parseInt(match[0]) || 0)
  let minutes = (parseInt(match[1]) || 0)
  let seconds = (parseInt(match[2]) || 0)
  let date = new Date(null)
  date.setSeconds(hours * 3600 + minutes * 60 + seconds)
  date = date.toISOString().substr(11, 8)
  if (date.split(':')[0] === '00') date = date.substr(3)
  return date
}
