/* global cfg */
let got = require('got')

module.exports = {
  name: ['word', 'w', 'wrd'],
  desc: 'Search for words using parameters. Type .w list for a list of parameters.',
  permission: '',
  usage: '<param>:<query>; <param2>:<query2>; <...>',
  args: 1,
  command: async function (msg, cmd, args) {
    if (args[0] === 'list') {
      msg.channel.send({
        embed: {
          color: 12391334,
          title: "List o' Word Parameters",
          description: '**ml** - Means like\n**sl** - Sounds like\n**sp** - Spelled Like\n**rel_[code]** - Related Word\n',
          fields: [
            {
              name: 'Codes',
              value: '**jja** - Noun from adjective\n**jjb** - Adjective from noun\n**syn** - Synonyms\n**trg** - Triggers\n**ant** - Antonyms\n**spc** - "Kind of"\n**gen** - "More general than"\n**com** - "Comprises"\n**par** - "Part of"\n**bga** - Frequent followers\n**bgb** - Frequent predecessors\n**rhy** - Rhymes\n**nry** - Approximate ryhmes\n**hom** - Homophones\n**cns** - Constant match\n'
            }
          ]
        }
      })
      return
    }
    let url = 'https://api.datamuse.com/words?v=enwiki' + formatParams(msg.content.slice(cmd.length + 1))
    let body = (await got(url, { json: true })).body
    if (body.length < 1) {
      msg.channel.send('Nothing found!')
      return
    }
    let wordlist = ''
    let len = body.length < 5 ? body.length : 5
    if (msg.content.startsWith(cfg.prefix.first)) len = 1
    for (let i = 0; i < len; i++) {
      wordlist += body[i].word + '\n'
    }
    msg.channel.send(wordlist)
  }
}

function formatParams (str) {
  let parts = str.split(';')
  for (let i = 0; i < parts.length; i++) {
    let index = parts[i].indexOf(':')
    let param = parts[i].substr(0, index).trim()
    let query = parts[i].substr(index + 1, parts[i].length).trim()
    parts[i] = param + '=' + encodeURIComponent(query)
  }
  return '&' + parts.join('&')
}
