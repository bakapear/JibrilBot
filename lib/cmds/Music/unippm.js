/* global cfg */
let got = require('got')

module.exports = {
  name: ['unippm', 'uni'],
  desc: 'Plays a track from UNIPPM.',
  permission: [],
  usage: '<query>',
  args: 1,
  command: async function (msg, cmd, args) {
    let Player = global.getPlayer(msg)
    if (!Player) {
      msg.channel.send("You're not in a voice channel!")
      return
    }
    let sound = await getUniTrack(args.join(''), msg.content.startsWith(cfg.prefix.random))
    let item = await Player.play(sound, msg.author)
    if (!item) msg.channel.send('Nothing found!')
    else if (item.error) msg.channel.send(item.error)
    else if (Player.active) Player.msgQueued(msg, item)
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
    type: 'url',
    url: body.grouped.workIdAndAlbumId.groups[mod].doclist.docs[0].wa[0].a,
    title: body.grouped.workIdAndAlbumId.groups[mod].doclist.docs[0].tt
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
