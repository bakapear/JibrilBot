let got = require('got')

module.exports = {
  name: ['osb', 'osba', 'osubeatmap'],
  desc: 'Search for an osu! beatmap. (osba for unranked aswell)',
  permission: '',
  usage: '(query)',
  args: 0,
  command: async function (msg, cmd, args) {
    let beatmaps = await getBeatmaps(args.join(' '), cmd === 'osba')
    if (!beatmaps || !beatmaps.length) return msg.channel.send('Nothing found!')
    let desc = formatMessage(beatmaps)
    msg.channel.send({
      embed: {
        color: 15033501,
        title: 'osu! beatmaps' + (args.length ? ` (${args.join(' ')})` : ''),
        description: desc.join('\n')
      }
    })
  }
}

async function getBeatmaps (query, all) {
  let url = 'https://bloodcat.com/osu/'
  let { body } = await got(url, {
    query: {
      mod: 'json',
      s: all ? '' : 1,
      m: 0,
      q: query
    },
    json: true
  })
  return body
}

function formatMessage (beatmaps) {
  let msg = []
  let len = beatmaps.length > 8 ? 8 : beatmaps.length
  for (let i = 0; i < len; i++) {
    let set = beatmaps[i]
    let diffs = set.beatmaps.map(x => Number(x.star).toFixed(2)).sort()
    diffs = (diffs.length > 8) ? `[${diffs[0]} | (${diffs.length - 2} inbetween) | ${diffs[diffs.length - 1]}]` : `[ ${diffs.join(' | ')} ]`
    let last = set.beatmaps[set.beatmaps.length - 1]
    let title = `${set.title} - ${set.artist}`
    if (title.length > 50) title = title.substr(0, 47) + '...'
    msg.push(`${i + 1}. [${title}](https://osu.ppy.sh/beatmapsets/${set.id}) [[DL]](https://osu.ppy.sh/beatmapsets/${set.id}/download)\n\`${diffs}\nBPM: ${parseInt(last.bpm)} Length: ${formatTime(parseInt(last.length * 1000))} Mapper: ${set.creator}\``)
  }
  return msg
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
