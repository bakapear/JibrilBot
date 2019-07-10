let got = require('got')

module.exports = {
  name: ['checkip', 'ip'],
  desc: 'Get more information about a specific ip!',
  permission: '',
  usage: '<ip>',
  args: 1,
  command: async function (msg, cmd, args) {
    let data = await checkIp(args.join(' ').trim())
    if (!data) msg.channel.send('Something went wrong!')
    else if (data.error) msg.channel.send(data.error)
    else {
      let desc = []
      if (data.registry) desc.push(`**Registry** ${data.registry}`)
      if (data.countrycode) desc.push(`**CountryCode** ${data.countrycode}`)
      if (data.countryname) desc.push(`**CountryName** ${data.countryname}`)
      if (data.asn && data.asn.name) desc.push(`**ASN** ${data.asn.name}`)
      if (data.detail) desc.push(`**Detail** ${data.detail}`)
      if (data.website && data.website.length) desc.push(`**Website** ${data.website[0]} [${data.website.length}]`)
      msg.channel.send({
        embed: {
          title: data.ip,
          color: 128313,
          description: desc.join('\r\n')
        }
      })
    }
  }
}

async function checkIp (ip) {
  try {
    let url = 'https://iplist.cc/api/' + ip
    let { body } = await got(url, { json: true })
    return body
  } catch (e) { if (e) return null }
}
