let got = require('got')
let apiOsu = process.env.API_OSU

module.exports = {
  name: ['osu'],
  desc: 'Displays a osu! profile',
  permission: '',
  usage: '<user>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getUser(args.join(' '))
    let user = body[0]
    if (!user) {
      msg.channel.send('User not found!')
      return
    }
    if (!user.pp_rank) {
      msg.channel.send('Not enough information about that user!')
      return
    }
    let top = await formatScore(await getUserTop(user.user_id))
    let recent = await formatScore(await getUserRecent(user.user_id))
    msg.channel.send({
      embed: {
        color: 15033501,
        title: `${user.username} :flag_${user.country.toLowerCase()}:`,
        url: `https://osu.ppy.sh/u/${user.user_id}`,
        thumbnail: {
          url: `https://a.ppy.sh/${user.user_id}`
        },
        fields: [{
          name: `Statistics`,
          value: `**Ranked** #${user.pp_rank}\n**PP** ${user.pp_raw}pp\n**Accuracy** ${parseFloat(user.accuracy).toFixed(2)}%\n**Level** ${user.level}\n**Play Count** ${user.playcount}`
        },
        {
          name: 'Misc',
          value: `**Ranked Score** ${user.ranked_score}\n**Total Score** ${user.total_score}\n**SS** ${user.count_rank_ss} **SSH** ${user.count_rank_ssh} **S** ${user.count_rank_s} **SH** ${user.count_rank_sh} **A** ${user.count_rank_a}\n**300x** ${user.count300} **100x** ${user.count100} **50x** ${user.count50}`
        },
        {
          name: 'Top Play',
          value: top
        },
        {
          name: 'Recent Play',
          value: recent
        }]
      }
    })
  }
}

async function getUser (query) {
  try {
    let url = 'https://osu.ppy.sh/api/get_user'
    let body = (await got(url, {
      query: {
        u: query,
        k: apiOsu
      },
      json: true
    })).body
    return body
  } catch (e) { if (e) return null }
}

async function getUserTop (query) {
  try {
    let url = 'https://osu.ppy.sh/api/get_user_best'
    let body = (await got(url, {
      query: {
        u: query,
        k: apiOsu,
        limit: 1
      },
      json: true
    })).body
    return body
  } catch (e) { if (e) return null }
}

async function getUserRecent (query) {
  try {
    let url = 'https://osu.ppy.sh/api/get_user_recent'
    let body = (await got(url, {
      query: {
        u: query,
        k: apiOsu,
        limit: 1
      },
      json: true
    })).body
    return body
  } catch (e) { if (e) return null }
}

async function getBeatmaps (id) {
  try {
    let url = 'https://osu.ppy.sh/api/get_beatmaps'
    let body = (await got(url, {
      query: {
        b: id,
        k: apiOsu,
        limit: 1
      },
      json: true
    })).body
    return body
  } catch (e) { if (e) return null }
}

let mods = {
  'None': 0,
  'NF': 1,
  'EZ': 2,
  'TD': 4,
  'HD': 8,
  'HR': 16,
  'SD': 32,
  'DT': 64,
  'RL': 128,
  'HT': 256,
  'NC': 512,
  'FL': 1024,
  'A': 2048,
  'SO': 4096,
  'AP': 8192,
  'PF': 16384,
  '4K': 32768,
  '5K': 65536,
  '6K': 131072,
  '7K': 262144,
  '8K': 524288,
  'FI': 1048576,
  'RD': 2097152,
  'C': 4194304,
  'TP': 8388608,
  '9K': 16777216,
  'CO': 33554432,
  '1K': 67108864,
  '3K': 134217728,
  '2K': 268435456,
  'V2': 536870912
}

function convertMods (val) {
  if (!val) return ''
  let res = ''
  for (let prop in mods) {
    if (mods.hasOwnProperty(prop)) {
      let bit = mods[prop]
      if (bit & val) res += prop
    }
  }
  if (res === '') res = 'None'
  return res
}

async function formatScore (score) {
  if (score.length) {
    score = score[0]
    let map = (await getBeatmaps(score.beatmap_id))[0]
    let pp = parseInt(score.pp)
    if (isNaN(pp)) pp = 0
    score = `[${map.artist} - ${map.title} [${map.version}] ☆${parseFloat(map.difficultyrating).toFixed(2)}](https://osu.ppy.sh/beatmapsets/${map.beatmapset_id}#osu/${map.beatmap_id})\n**Rank** ${score.rank} **PP** ${pp} **Mods** ${convertMods(score.enabled_mods)} **Score** ${score.score} **Combo** ${score.maxcombo}\n**300x** ${score.count300} **100x** ${score.count100} **50x** ${score.count50} **Misses** ${score.countmiss}`
  } else score = 'None yet.'
  return score
}
