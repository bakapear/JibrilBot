let got = require('got')

module.exports = {
  name: ['tflo', 'tfloadout'],
  desc: 'Get a random TF2 loadout.',
  permission: '',
  usage: '(class)',
  args: 0,
  command: async function (msg, cmd, args) {
    let tfclass = 'Random'
    if (args[0]) {
      if (CLASSES.map(x => x.toLowerCase()).includes(args[0].toLowerCase())) {
        tfclass = args[0][0].toUpperCase() + args[0].substr(1).toLowerCase()
      } else {
        msg.channel.send('Invalid class!')
        return
      }
    }
    let url = 'https://api.genr8rs.com/Generator/Gaming/Tf2/LoadoutGenerator'
    let body = (await got(url, {
      query: { '_sChosenClass': tfclass },
      json: true
    })).body
    let items = []
    for (let item in body) {
      if (item === '_sChosenClass') continue
      items.push(`**${item.substr(2)}:** \`${body[item]}\``)
    }
    msg.channel.send({
      embed: {
        title: 'Random TF2 Loadout for ' + body._sChosenClass,
        description: items.join('\n'),
        color: 5456442
      }
    })
  }
}

let CLASSES = ['Scout', 'Soldier', 'Pyro', 'Demoman', 'Heavy', 'Engineer', 'Medic', 'Sniper', 'Spy']
