let got = require('got')

let table = {
  title: {},
  artist: {},
  source: {},
  mapper: {},
  diff: {
    name: 'diff_name'
  },
  genre: {
    name: 'genres',
    upper: true,
    rewrites: {
      videogame: 'Video Game',
      hiphop: 'Hip Hop'
    },
    values: ['Anime', 'Video Game', 'Novelty', 'Electronic', 'Pop', 'Rock', 'Hip Hop', 'Other', 'Any']
  },
  lang: {
    name: 'languages',
    upper: true,
    values: ['Japanese', 'Instrumental', 'English', 'Korean', 'Chinese', 'German', 'Spanish', 'Italian', 'French', 'Other', 'Any']
  },
  status: {
    name: 'statuses',
    upper: true,
    values: ['Ranked', 'Qualified', 'Loved', 'Unranked']
  },
  mode: {
    name: 'modes',
    upper: true,
    rewrites: {
      ctb: 'CtB'
    },
    values: ['Standard', 'Mania', 'Taiko', 'CtB']
  },
  length: {
    name: ['min_length', 'max_length'],
    type: 'number'
  },
  bpm: {
    name: ['min_bpm', 'max_bpm'],
    type: 'number'
  },
  favorites: {
    name: ['min_favorites', 'max_favorites'],
    type: 'number'
  },
  playcount: {
    name: ['min_play_count', 'max_play_count'],
    type: 'number'
  },
  stars: {
    name: 'star',
    type: 'range'
  },
  ar: {
    type: 'range'
  },
  od: {
    type: 'range'
  },
  cs: {
    type: 'range'
  },
  hp: {
    type: 'range'
  },
  order: {
    name: 'query_order',
    type: 'option',
    rewrites: {
      date: '',
      length: 'play_length',
      playcount: 'play_count',
      ar: 'difficulty_ar',
      od: 'difficulty_od',
      hp: 'difficulty_hp',
      cs: 'difficulty_cs'
    },
    values: ['date', 'difficulty', 'favorites', 'length', 'playcount', 'ar', 'od', 'hp', 'cs', 'bpm']
  },
  premium: {
    name: 'premium_mappers',
    rewrites: {
      yes: 'true',
      no: 'false'
    },
    values: ['yes', 'no']
  },
  offset: {
    type: 'number'
  }
}

module.exports = {
  name: ['oss', 'osusearch'],
  desc: 'Search for an osu! beatmap with filters. Type list for a list of filters.',
  permission: '',
  usage: '(list) | (filter:value) (filter:value1,value2) ...',
  args: 0,
  command: async function (msg, cmd, args) {
    if (args[0] === 'list') {
      let desc = []
      for (let prop in table) {
        let val = '<query>'
        if (table[prop].values) val = `[${table[prop].values.join(' | ')}]`
        else if (table[prop].type === 'number' || table[prop].type === 'range') val = '<number>'
        desc.push(`**${prop}**: \`${val}\``)
      }
      return msg.channel.send({
        embed: {
          color: 15033501,
          title: 'osu! search filters' + (args.length ? ` (${args.join(' ')})` : ''),
          description: desc.join('\n')
        }
      })
    }
    let query = formatQuery(args.join(' '))
    if (query.constructor === Error) return msg.channel.send(query.message)
    if (!Object.keys(query).length) return msg.channel.send('Missing filters!')
    let beatmaps = await getBeatmaps(query)
    if (!beatmaps || !beatmaps.length) return msg.channel.send('Nothing found!')
    let desc = formatMessage(beatmaps)
    msg.channel.send({
      embed: {
        color: 15033501,
        title: 'osu! search',
        description: desc.join('\n')
      }
    })
  }
}

function formatQuery (query) {
  let matches = query.match(/([^ ]+):([^ ]+)/g)
  if (!matches) return {}
  let res = {}
  for (let i = 0; i < matches.length; i++) {
    let match = matches[i].split(':')
    let filter = match[0]
    let value = match[1].replace(/\+/g, ' ')
    if (table[filter]) {
      let reverse = false
      if (table[filter].type === 'option') {
        if (value[0] === '-') {
          value = value.substr(1)
          reverse = true
        }
      }
      if (table[filter].rewrites) value = value.split(',').map(x => table[filter].rewrites[x] || x).join(',')
      if (table[filter].upper) value = value.split(',').map(x => x[0].toUpperCase() + x.substr(1)).join(',')
      if (table[filter].type === 'range') {
        let parts = value.split('-')
        if (isNaN(parts[0])) return Error(`Invalid '${filter}' value: '${value}'`)
        if (isNaN(parts[1])) parts[1] = parts[0]
        value = `(${Number(parts[0]).toFixed(2)},${Number(parts[1]).toFixed(2)})`
      }
      let name = table[filter].name || filter
      if (name.constructor === Array) {
        value = value.split('-')
        for (let j = 0; j < name.length; j++) {
          if (value[j]) res[name[j]] = value[j]
        }
      } else {
        if (reverse) value = '-' + value
        res[name] = value
      }
    } else {
      return Error(`Unknown filter: '${filter}'`)
    }
  }
  return res
}

async function getBeatmaps (query) {
  let url = 'https://osusearch.com/query'
  let { body } = await got(url, {
    query: query,
    json: true
  })
  return body.beatmaps
}

function formatMessage (beatmaps) {
  let msg = []
  let len = beatmaps.length > 5 ? 5 : beatmaps.length
  for (let i = 0; i < len; i++) {
    let set = beatmaps[i]
    let diff = `${set.difficulty.toFixed(2)}☆ | CS: ${set.difficulty_cs.toFixed(2)} | AR: ${set.difficulty_ar.toFixed(2)} | OD: ${set.difficulty_od.toFixed(2)} | HP: ${set.difficulty_hp.toFixed(2)}`
    let title = `${set.title} - ${set.artist}`
    if (title.length > 50) title = title.substr(0, 47) + '...'
    let mode = { 0: 'osu', 1: 'taiko', 2: 'fruits', 3: 'mania' }
    let status = { [-2]: 'Graveyard', [-1]: 'WIP', 0: 'Pending', 1: 'Ranked', 3: 'Qualified', 4: 'Loved' }
    msg.push(`${i + 1}. [${title}](https://osu.ppy.sh/beatmapsets/${set.beatmapset_id}#${mode[set.gamemode]}/${set.beatmap_id}) [[DL]](https://osu.ppy.sh/beatmapsets/${set.beatmapset_id}/download)\n\`${diff}\nDifficulty: [${set.difficulty_name}]\nStatus: [${status[set.beatmap_status]}] Date: [${new Date(set.date).toLocaleDateString('en-US')}]\nBPM: ${parseInt(set.bpm)} Length: ${formatTime(parseInt(set.play_length * 1000))} Mapper: ${set.mapper}\``)
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
