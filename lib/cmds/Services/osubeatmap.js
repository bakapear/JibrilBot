let got = require('got')

module.exports = {
  name: ['osb', 'osubeatmap', 'osub'],
  desc: 'Search for an osu beatmap',
  permission: '',
  usage: '(min star) (max star) ; (name)',
  args: 0,
  command: async function (msg, cmd, args) {
    let min
    let max
    if (args[1] === ';') {
      min = args[0]
      max = 10
      args.splice(0, 2)
    } else if (args[2] === ';') {
      min = args[0]
      max = args[1]
      args.splice(0, 3)
    }
    let maps = await getBeatmaps(args.join(' '), min, max)
    if (!maps.length) {
      msg.channel.send('Nothing found!')
      return
    }
    let songs = []
    let len = maps.length > 10 ? 10 : maps.length
    for (let i = 0; i < len; i++) {
      songs.push((i + 1) + '. ' + '[' + maps[i].artist + ' - ' + maps[i].title + ']' + '(https://osu.ppy.sh/beatmapsets/' + maps[i].beatmapset_id + '/download)' + ' \n`' +
                ' ☆' + maps[i].difficulty.toFixed(2) +
                ' (ar' + maps[i].difficulty_ar.toFixed(1) +
                '|od' + maps[i].difficulty_od.toFixed(1) +
                '|cs' + maps[i].difficulty_cs.toFixed(1) +
                '|hp' + maps[i].difficulty_hp.toFixed(1) +
                ') ' + maps[i].bpm + 'bpm [' + formatTime(maps[i].play_length * 1000) + ']`\n')
    }
    msg.channel.send({
      embed: {
        color: 15033501,
        title: 'osu! beatmaps',
        description: songs.join('\n')
      }
    })
  }
}

async function getBeatmaps (name, min, max) {
  let diff = min && max ? `(${min},${max})` : undefined
  let url = 'https://osusearch.com/query/'
  let body = (await got(url, {
    query: {
      title: name,
      statuses: 'Ranked',
      modes: 'Standard',
      star: diff
    },
    json: true
  })).body
  return body.beatmaps
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
