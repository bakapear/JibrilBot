let got = require('got')

let token = process.env.API_DUNGEON
let last = {}

module.exports = {
  name: ['dungeon', 'd'],
  desc: 'Do some magical shit',
  permission: '',
  usage: '<text/RESET/LAST>',
  args: 1,
  command: async function (msg, cmd, args) {
    let input = args.join(' ').trim()
    if (input === 'RESET') {
      last = {}
      return msg.channel.send('Reset Dungeon.')
    }
    if (input === 'LAST') {
      if (!last.text) return msg.channel.send('Nothing to show!')
      return msg.channel.send('`' + last.text + '`')
    }
    if (last.id) {
      await say(input)
      return msg.channel.send('`' + last.text + '`')
    } else {
      await create(input)
      return msg.channel.send('`' + last.text + '`')
    }
  }
}

async function create (text) {
  let url = 'https://api.aidungeon.io/sessions'
  let { body } = await got(url, {
    method: 'POST',
    headers: {
      'x-access-token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      storyMode: 'custom',
      characterType: null,
      name: null,
      customPrompt: text,
      promptId: null
    })
  })
  body = JSON.parse(body)
  last.text = body.story[body.story.length - 1].value
  last.id = body.id
  return body
}

async function say (text) {
  let url = 'https://api.aidungeon.io/sessions/' + last.id + '/inputs'
  let { body } = await got(url, {
    method: 'POST',
    headers: {
      'x-access-token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: text })
  })
  body = JSON.parse(body)
  last.text = body[body.length - 1].value
  return body
}
