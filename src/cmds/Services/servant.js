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
    let id = servants.findIndex(x => x.name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
    if (!query) id = Math.floor(Math.random() * servants.length)
    if (id === -1) return msg.channel.send(`Servant '${query}' not found!`)
    let servant = servants[id]
    let info = await getServantInfo(servant)
    let gender = ['♂', '♀', '?']
    msg.channel.send({
      embed: {
        author: {
          name: `${servant.name} (${servant.stars}) ${gender[info.gender]}`,
          url: servant.url,
          icon_url: info.icon
        },
        color: 15324002,
        description: info.desc.join(' '),
        thumbnail: {
          url: info.img
        },
        image: {
          url: info.deck
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
  let icon = $('.ServantInfoClass > a > img')[0].attribs['data-src']
  let deck = $('.closetable th > img')[0].attribs['data-src']
  let desc = $('.ServantInfoStatsWrapper > table:nth-child(1) > tbody').text().split('\n').filter(x => x !== '')
  let gender = ['Male', 'Female', 'Unknown']
  if (!desc[1].startsWith('AKA')) desc.splice(1, 0, null)
  desc = desc.map((x, i, a) => {
    if (i === 18) gender = gender.indexOf(a[i].split(':')[1].trim())
    if ([2, 6, 7, 10, 11, 18].includes(i) || a[i] === null) return i === 7 ? '\n' : null
    let parts = x.replace(/<img.*?>/, '').split(': ').map(x => x.trim())
    let res = `**${parts[0].replace('Voice Actor', 'Voice').replace('Illustrator', 'Art')}**: ${parts[1]}`
    if (i === 3) res += `${desc[10].replace('Attribute', '**Attribute**')}`
    if (i === 4) res += ` (${a[6].split(':')[1].trim()})`
    if (i === 5) res += ` (${a[7].split(':')[1].trim()})`
    if ([0, 1, 2, 3, 9, 13, 15].includes(i)) res += '\n'
    return res
  }).filter(x => x !== null)
  return { desc, img, icon, deck, gender }
}
