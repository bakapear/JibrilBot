let got = require('got')
let cheerio = require('cheerio')

module.exports = {
  name: ['steam'],
  desc: 'Get information about a steam profile.',
  permission: '',
  usage: '<steamID/steamID3/steamID64/customURL>',
  args: 1,
  command: async function (msg, cmd, args) {
    let body = await getSteamData(args[0])
    if (!body) {
      msg.channel.send('Something went wrong!')
      return
    }
    msg.channel.send({ embed: {
      title: body.title,
      thumbnail: {
        url: body.avatar
      },
      description: `**steamID**: ${body.id}\n**steamID3**: ${body.id3}\n**steamID64**: ${body.id64}\n**customURL**: ${body.custom}\n**profile**: ${body.profile}\n**profile state**: ${body.state}\n**profile created**: ${body.created}\n**name**: ${body.name}\n**real name**: ${body.real}\n**location**: ${body.location}`,
      color: '12838131'
    } })
  }
}

async function getSteamData (query) {
  try {
    let url = 'https://steamidfinder.com/lookup/' + query
    let html = (await got(url)).body
    let $ = cheerio.load(html)

    let panel = $('.panel-body')[0].children
    let vals = []
    for (let i = 0; i < panel.length; i++) {
      if (panel[i].data) vals.push(panel[i].data.trim())
      else if (panel[i].children.length) {
        if (panel[i].children[0].data) vals.push(panel[i].children[0].data.trim())
        else if (panel[i].children[0].children.length) {
          vals.push(panel[i].children[0].children[0].data)
        }
      }
    }
    vals = vals.filter(x => x !== '')
    vals.length = vals.indexOf('location') + 2
    let prof = {}
    for (let i = 0; i < vals.length; i += 2) {
      prof[vals[i]] = vals[i + 1]
    }
    let body = {
      title: $('.profile-bar>h1')[0].children[0].children[0].data,
      avatar: $('.avatar')[0].attribs.src,
      id: prof['steamID:'],
      id3: prof['steamID3:'],
      id64: prof['steamID64:'],
      custom: prof['customURL'],
      profile: prof['profile'],
      state: prof['profile state'],
      created: prof['profile created'],
      name: prof['name'],
      real: prof['real name'],
      location: prof['location']
    }
    return body
  } catch (e) { if (e) return null }
}
