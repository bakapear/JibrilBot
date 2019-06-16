let got = require('got')
let FormData = require('form-data')

module.exports = {
  name: ['osp', 'osupp', 'pp'],
  desc: 'Get pp data about your score!',
  permission: '',
  usage: '(beatmap id) (accuracy:%) (miss:m) (combo:x) (mods)',
  args: 1,
  command: async function (msg, cmd, args) {
    let data = await getMapData(args.join(' '))
    if (!data) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (data.error) {
      msg.channel.send(data.error)
      return
    }
    msg.channel.send('```' + data + '```')
  }
}

async function getMapData (input) {
  let opt = parseMapInput(input)
  if (!opt) return { error: 'Error parsing input!' }
  if (!opt.map) return { error: 'Missing beatmap id!' }
  if (!opt.acc) return { error: 'Missing accuracy!' }
  if (!opt.miss) return { error: 'Missing misses!' }
  if (!opt.combo) return { error: 'Missing combo!' }
  opt.file = await getMapBuffer(opt.map)
  if (!opt.file) return { error: 'Invalid beatmap id!' }
  let data = await getPPData(opt)
  if (!data) return { error: 'Error getting PP data!' }
  return data
}

function parseMapInput (input) {
  if (!input) return null
  let parts = input.trim().split(' ')
  let acc = null
  let misses = null
  let combo = null
  let map = null
  let mod = ''
  let mods = ['dt', 'ez', 'fl', 'ht', 'hr', 'hd', 'nf', 'so']
  for (let i = 0; i < parts.length; i++) {
    if (!isNaN(parts[i])) {
      map = parts[i]
    } else {
      let part = parts[i].substr(0, parts[i].length - 1)
      if (parts[i].endsWith('%')) {
        if (!isNaN(part)) acc = part
      } else if (parts[i].endsWith('x')) {
        if (!isNaN(part)) combo = part
      } else if (parts[i].endsWith('m')) {
        if (!isNaN(part)) misses = part
      } else if (mods.some(x => parts[i].toLowerCase().indexOf(x))) {
        let match = parts[i].toLowerCase().replace(/dt|ez|fl|ht|hr|hd|nf|so/g, '$&,')
        mod = match.substr(0, match.length - 1)
      }
    }
  }
  return {
    map: map,
    mods: mod,
    acc: acc,
    miss: misses,
    combo: combo
  }
}

async function getMapBuffer (map) {
  try {
    let url = 'https://osu.ppy.sh/osu/' + map
    let body = (await got(url, { encoding: null })).body
    return body
  } catch (e) { if (e) return null }
}

async function getPPData (score) {
  try {
    let form = new FormData()
    form.append('map', score.file, { filename: 'map.osu' })
    form.append('acc', score.acc)
    form.append('misses', score.miss)
    form.append('combo', score.combo)
    form.append('mods', score.mods)
    let url = 'https://osu.bitti.io/oppai'
    let body = (await got.post(url, {
      body: form
    })).body
    body = JSON.parse(body)
    if (body.error) { return null }
    return body.output
  } catch (e) { if (e) return null }
}
