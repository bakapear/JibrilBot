let { doChecks, checks, voice, showPlayMessage, playQueue, cfg } = global
let got = require('got')

module.exports = {
  name: ['uni', 'unippm', 'funi', 'funippm'],
  desc: 'Plays a track from UNIPPM.',
  permission: '',
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    if (doChecks(checks, msg, 3)) return
    if (!voice[msg.guild.id].chan) {
      voice[msg.guild.id].chan = msg.member.voiceChannel
      voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
    }
    let mod = msg.content.startsWith(cfg.prefix.random)
    let song = await getUniTrack(args.join(' '), mod)
    if (!song) {
      msg.channel.send('Nothing found!')
      return
    }
    if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
      let last = 1
      if (cmd === 'funi' || cmd === 'funippm') voice[msg.guild.id].queue.splice(1, 0, song)
      else {
        voice[msg.guild.id].queue.push(song)
        last = voice[msg.guild.id].queue.length - 1
      }
      showPlayMessage(msg, 'Added to Queue', voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
    } else {
      voice[msg.guild.id].queue = []
      voice[msg.guild.id].queue.push(song)
      voice[msg.guild.id].msg = msg
      playQueue(msg)
    }
  }
}

async function getUniTrack (args, rnd) {
  let query = {
    q: '(' + args + ')',
    qf: [
      'tagsLowercase^4',
      'tagsHiddenLowercase^4',
      'tagsNGram^4',
      'tagsTokenised^4',
      'trackDescription^4',
      'albumNumberNGram^2',
      'releaseDate^2',
      'labelId^2',
      'albumId^2',
      'workId^2',
      'versionId^2',
      'composers'
    ],
    sort: 'score desc,releaseDate desc,trackTitleRaw asc',
    group: true,
    'group.field': 'workIdAndAlbumId',
    'group.ngroups': true,
    'group.facet': true,
    'group.sort': 'versionTypeOrderId asc, bestWorkAudioDurationOrderId asc, bestWorkAudioActualDuration desc, trackNoFloat asc',
    spellcheck: 'off',
    start: 0,
    rows: 20,
    'q.op': 'AND',
    pf: 'composers^32'
  }
  let url = 'https://cloud1.search.universalproductionmusic.com/uppm_work_3_1/select' + formatOldQuery(query)
  let body = (await got(url, {
    json: true
  })).body
  if (body.grouped.workIdAndAlbumId.matches === 0) return
  let mod = rnd ? Math.floor(Math.random() * body.grouped.workIdAndAlbumId.groups.length) : 0
  return {
    type: 'unippm',
    link: body.grouped.workIdAndAlbumId.groups[mod].doclist.docs[0].wa[0].a,
    name: body.grouped.workIdAndAlbumId.groups[mod].doclist.docs[0].tt
  }
}

function formatOldQuery (obj) {
  let params = []
  for (let prop in obj) {
    if (obj[prop].constructor === Array) {
      for (let i = 0; i < obj[prop].length; i++) {
        params.push(prop + '=' + encodeURIComponent(obj[prop][i]))
      }
    } else params.push(prop + '=' + encodeURIComponent(obj[prop]))
  }
  return '?' + params.join('&')
}
