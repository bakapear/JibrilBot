let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['osutop', 'ost'],
  desc: 'Gets the top 10 performance/season/score/country players on osu!standard',
  permission: '',
  usage: '(performance/season/score/country)',
  args: 0,
  command: async function (msg, cmd, args) {
    let top = await getTop(args[0], 10)
    if (!top) {
      msg.channel.send('Something went wrong!')
      return
    }
    let players = []
    for (let i = 0; i < top.length; i++) {
      players.push(`${top[i].rank} - :flag_${top[i].flag.toLowerCase()}: [${top[i].name.replace(/[*_~]/g, '\\$&')}](${top[i].url}) [${top[i].info}]`)
    }
    msg.channel.send({
      embed: {
        color: 15033501,
        title: 'osu! TOP 10 - ' + top[0].type,
        description: players.join('\r\n')
      }
    })
  }
}

async function getTop (type, limit) {
  try {
    if (!type) type = 'performance'
    let url = 'https://osu.ppy.sh/rankings/osu/performance'
    type = type.toLowerCase()
    if (type === 'season') url = 'https://osu.ppy.sh/rankings/osu/charts'
    else if (type === 'score') url = 'https://osu.ppy.sh/rankings/osu/score'
    else if (type === 'country') url = 'https://osu.ppy.sh/rankings/osu/country'
    else type = 'performance'
    let body = (await got(url)).body
    let $ = cheerio.load(body)
    let ranks = $('.ranking-page-table__row')
    let top = []
    for (let i = 0; i < ranks.length; i++) {
      let col = $(ranks[i]).find('td')
      let data = {
        type: type,
        rank: col[0].children[0].data.trim(),
        flag: $(col[1]).find('.flag-country')[0].attribs.style.match(/flags\/(.*?).png/)[1]
      }
      if (type === 'performance') {
        data.url = $(col[1]).find('.ranking-page-table__user-link-text')[0].attribs.href
        data.name = $(col[1]).find('.ranking-page-table__user-link-text').text().trim()
        data.info = col[4].children[0].data.trim()
      }
      if (type === 'season' || type === 'score') {
        data.url = $(col[1]).find('.ranking-page-table__user-link-text')[0].attribs.href
        data.name = $(col[1]).find('.ranking-page-table__user-link-text').text().trim()
        data.info = col[5].children[1].attribs.title
      }
      if (type === 'country') {
        data.url = $(col[1]).find('.ranking-page-table__country-link')[0].attribs.href
        data.name = $(col[1]).find('.ranking-page-table__country-link-text').text().trim()
        data.info = col[6].children[1].attribs.title
      }
      top.push(data)
    }
    if (top.length > limit) top.length = limit
    return top
  } catch (e) { if (e) return null }
}
