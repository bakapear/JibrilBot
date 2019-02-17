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
    let num = 7
    let d = x => { return (num += 2) }
    let chk = x => {
      if (x) return x
      else {
        num -= 2
        return { children: [{ data: 'N/A' }] }
      }
    }
    let body = {
      title: $('.profile-bar>h1')[0].children[0].data,
      avatar: $('.avatar')[0].attribs.src,
      id: chk($(`.panel-body > code:nth-child(${num})`)[0]).children[0].data,
      id3: chk($(`.panel-body > code:nth-child(${d(num)})`)[0]).children[0].data,
      id64: chk($(`.panel-body > code:nth-child(${d(num)})`)[0]).children[0].data,
      custom: chk($(`.panel-body > code:nth-child(${d(num)}) > a`)[0]).children[0].data,
      profile: chk($(`.panel-body > code:nth-child(${d(num)}) > a`)[0]).children[0].data,
      state: chk($(`.panel-body > code:nth-child(${d(num)})`)[0]).children[0].data,
      created: chk($(`.panel-body > code:nth-child(${d(num)})`)[0]).children[0].data,
      name: chk($(`.panel-body > code:nth-child(${d(num)})`)[0]).children[0].data,
      real: chk($(`.panel-body > code:nth-child(${d(num)})`)[0]).children[0].data,
      location: chk($(`.panel-body > code:nth-child(${d(num)})`)[0]).children[0].data
    }
    return body
  } catch (e) { if (e) return null }
}
