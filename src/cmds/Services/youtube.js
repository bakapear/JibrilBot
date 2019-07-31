/* global cfg */
let got = require('got')
let apiGoogle = process.env.API_GOOGLE

module.exports = {
  name: ['youtube', 'yt', 'playlist', 'ytpl', 'ytchannel', 'ytchan'],
  desc: 'Finds a youtube video/playlist/channel (or gets list of results if with random prefix)',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let type = 'video'
    if (cmd === 'playlist' || cmd === 'ytpl') type = 'playlist'
    if (cmd === 'ytchannel' || cmd === 'ytchan') type = 'channel'
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
          color: 16711680,
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
      key: apiGoogle,
      maxResults: 10
    },
    json: true
  })).body
  if (!body.items.length) return
  let items = []
  let ids = []
  for (let i = 0; i < body.items.length; i++) {
    let id = body.items[i].id.videoId || body.items[i].id.playlistId || body.items[i].id.channelId
    ids.push(id)
    let url = 'https://youtube.com/watch?v='
    if (type === 'playlist') url = 'https://youtube.com/playlist?list='
    if (type === 'channel') url = 'https://www.youtube.com/channel/'
    items.push({
      name: body.items[i].snippet.title,
      url: url + id
    })
  }
  let info = []
  if (type === 'video') info = await getDurations(ids)
  if (type === 'playlist') info = await getPlaylistLengths(ids)
  if (type === 'channel') info = await getSubscribers(ids)
  for (let i = 0; i < items.length; i++) {
    items[i].size = info[i]
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

async function getSubscribers (ids) {
  let url = 'https://www.googleapis.com/youtube/v3/channels'
  let body = (await got(url, {
    query: {
      id: ids.join(','),
      part: 'statistics',
      key: apiGoogle
    },
    json: true
  })).body
  let times = []
  for (let i = 0; i < body.items.length; i++) {
    times.push(body.items[i].statistics.subscriberCount + ' Subs')
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
