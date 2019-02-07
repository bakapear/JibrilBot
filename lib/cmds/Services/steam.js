let got = require('got')
let apiSteam = process.env.API_STEAM

module.exports = {
  name: ['steam'],
  desc: 'Displays a steam profile!',
  permission: '',
  usage: '<customurl/profileid>',
  args: 1,
  command: async function (msg, cmd, args) {
    let input = msg.content.slice(cmd.length + 1).trim()
    let id = await customToId(input)
    if (!id) id = input
    let body = (await getSteamSummary(id))
    if (!body) {
      msg.channel.send('User not found!')
      return
    }
    body = body[0]
    let friends = await getSteamFriends(id)
    let buddy = 'N/A'
    if (friends) buddy = (await getSteamSummary(friends[Math.floor(Math.random() * friends.length)].steamid))[0]
    let date = new Date(body.timecreated * 1000)
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let time = `${date.getDate()}th ${months[date.getMonth()]} ${date.getFullYear()}`
    let flag = 'N/A'
    if (body.loccountrycode) flag = `:flag_${body.loccountrycode.toLowerCase()}:`
    msg.channel.send({
      embed: {
        color: 8555775,
        title: body.personaname,
        url: body.profileurl,
        thumbnail: { url: body.avatarfull },
        description: '**Realname** ' + (body.realname ? body.realname : 'N/A') + '\n**Country** ' + flag + '\n**Created on** ' + time + '\n**Friends** ' + (friends ? (friends.length ? friends.length : 0) : 0),
        fields: [
          {
            name: 'Random Friend',
            value: `[${buddy.personaname}](${buddy.profileurl})`
          }
        ]
      }
    })
  }
}

async function getSteamFriends (id) {
  let url = 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/'
  let body = (await got(url, {
    json: true,
    query: {
      key: apiSteam,
      steamid: id,
      relationship: 'friend'
    }
  })).body
  if (!body || body.friendslist.friends.length < 1) return
  return body.friendslist.friends
}

async function getSteamSummary (id) {
  let url = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
  let body = (await got(url, {
    json: true,
    query: {
      key: apiSteam,
      steamids: id
    }
  })).body
  if (!body || !body.response.players || body.response.players.length < 1) return
  return body.response.players
}

async function customToId (customurl) {
  let url = 'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/'
  let body = (await got(url, {
    json: true,
    query: {
      key: apiSteam,
      vanityurl: customurl
    }
  })).body
  if (!body || body.response.success !== 1) return
  return body.response.steamid
}
