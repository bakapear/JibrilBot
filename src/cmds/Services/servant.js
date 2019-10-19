let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['servant'],
  desc: 'Get info about a Fate/Grand Order servant',
  permission: '',
  usage: '(query)',
  args: 0,
  command: async function (msg, cmd, args) {
    let query = args.join(' ')
    let servants = await getServants(['1-100', '101-200', '201-300'])
    let id = servants.findIndex(x => x.name.toLowerCase().indexOf(query) >= 0)
    if (!query) id = Math.floor(Math.random() * servants.length)
    if (id === -1) return msg.channel.send(`Servant '${query}' not found!`)
    let servant = servants[id]
    let info = await getServantInfo(servant)
    msg.channel.send({
      embed: {
        title: `${servant.name} (${servant.stars})`,
        color: 15324002,
        url: servant.url,
        description: info.desc.join('\n'),
        thumbnail: {
          url: info.img
        }
      }
    })
  }
}

async function getServants (ranges) {
  let url = 'https://fategrandorder.fandom.com/wiki/Sub:Servant_List_by_ID/'
  let arr = []
  for (let i = 0; i < ranges.length; i++) {
    let { body } = await got(url + ranges[i], { query: { action: 'render' } })
    let $ = cheerio.load(body)
    let tr = $('tr')
    for (let j = 1; j < tr.length; j++) {
      let item = {
        id: parseInt(tr[j].children[4].children[0].data.trim()),
        name: tr[j].children[2].children[1].attribs.title,
        url: tr[j].children[2].children[1].attribs.href,
        rarity: (tr[j].children[3].children[0].data.trim().length + 1) / 2,
        stars: tr[j].children[3].children[0].data.trim()
      }
      arr.push(item)
    }
  }
  return arr
}

async function getServantInfo (servant) {
  let { body } = await got(servant.url)
  let $ = cheerio.load(body)
  let img = $('#pi-tab-0 > figure > a > img')[0].attribs.src
  let desc = $('.ServantInfoStatsWrapper > table:nth-child(1) > tbody').text().split('\n').filter(x => x !== '')
  desc = desc.map(x => {
    let parts = x.replace(/<img.*?>/, '').split(': ').map(x => x.trim())
    return `**${parts[0]}**: ${parts[1]}`
  })
  return { desc: desc, img: img }
}
