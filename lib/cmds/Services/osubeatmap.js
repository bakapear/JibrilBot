let got = require('got')
let fs = require('fs')
let apiOsu2 = process.env.API_OSU2

module.exports = {
  name: ['osba', 'osb', 'osubeatmap', 'osub', 'osumap'],
  desc: 'Search for an osu! beatmap',
  permission: '',
  usage: '(query)',
  args: 0,
  command: async function (msg, cmd, args) {
    let maps = await getBeatmaps(args.join(' '), cmd !== 'osba')
    if (!maps.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let songs = []
    let len = maps.length > 8 ? 8 : maps.length
    if (len > 1) {
      for (let i = 0; i < len; i++) {
        let title = maps[i].artist + ' - ' + maps[i].title
        if (title.length > 50) title = title.substr(0, 47) + '...'

        let diffs = []
        for (let j = 0; j < maps[i].beatmaps.length; j++) {
          diffs.push(maps[i].beatmaps[j].difficulty_rating.toFixed(2))
        }
        diffs = diffs.sort((a, b) => a - b)
        let time = formatTime(maps[i].beatmaps[0].total_length * 1000)
        songs.push(`${i + 1}. [${title}](https://osu.ppy.sh/beatmapsets/${maps[i].id}) [[DL]](https://osu.ppy.sh/beatmapsets/${maps[i].id}/download)\n\`[ ${diffs.join(' | ')} ]\`\n\`BPM: ${maps[i].bpm} Length: ${time} Mapper: ${maps[i].creator}\``)
      }
      msg.channel.send({
        embed: {
          color: 15033501,
          title: 'osu! beatmaps',
          description: songs.join('\n')
        }
      })
    } else {
      let map = maps[0]
      let title = map.artist + ' - ' + map.title
      let time = formatTime(map.beatmaps[0].total_length * 1000)
      let diffs = []
      for (let i = 0; i < map.beatmaps.length; i++) {
        let diff = map.beatmaps[i]
        diffs.push(`[${diff.version}](https://osu.ppy.sh/beatmapsets/${diff.beatmapset_id}#osu/${diff.id}) - ☆${diff.difficulty_rating.toFixed(2)} \`ar${diff.ar.toFixed(1)}|od${diff.accuracy.toFixed(1)}|cs${diff.cs.toFixed(1)}|hp${diff.drain.toFixed(1)}\` [${formatTime(diff.hit_length * 1000)}]`)
      }
      msg.channel.send({
        embed: {
          color: 15033501,
          title: title,
          url: `https://osu.ppy.sh/beatmapsets/${map.id}`,
          description: `**BPM** ${map.bpm} **Length** ${time} **Plays** ${map.play_count} **Favs** ${map.favourite_count}\n\n${diffs.join('\n')}`,
          thumbnail: {
            url: map.covers['list@2x']
          },
          footer: {
            icon_url: 'https://a.ppy.sh/' + map.user_id,
            text: map.creator
          },
          timestamp: map.ranked_date
        }
      })
      let stream = got.stream('https:' + map.preview_url).pipe(fs.createWriteStream('lib/data/temp/preview.mp3'))
      stream.on('finish', () => msg.channel.send({ files: ['lib/data/temp/preview.mp3'] }))
    }
  }
}

async function getBeatmaps (query, ranked) {
  try {
    if (query.startsWith('https://osu.ppy.sh/beatmapsets/')) query = query.substr(31)
    let url = 'https://osu.ppy.sh/beatmapsets/search'
    let body = (await got(url, {
      query: {
        q: query,
        m: 0,
        s: ranked ? undefined : 7
      },
      headers: {
        cookie: 'osu_session=' + apiOsu2
      },
      json: true
    })).body
    return body.beatmapsets
  } catch (e) { if (e) return null }
}

function formatTime (ms) {
  let t = new Date(ms).toISOString().substr(11, 8).split(':')
  if (t[0] === '00') {
    if (t[1] === '00') {
      t = t.splice(2)
      t.unshift('0')
    } else {
      if (t[1].startsWith('0')) t[1] = t[1].substr(1)
      t = t.splice(1)
    }
  }
  if (t[0].startsWith('0') && t[1] !== '00') t[0] = t[0].substr(1)
  t = t.join(':')
  if (t.startsWith(':')) t = '0' + t
  return t
}
