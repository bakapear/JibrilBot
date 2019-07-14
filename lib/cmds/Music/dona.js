let got = require('got')

module.exports = {
  name: ['dona'],
  desc: 'Make the bot say something in Text-To-Speech the IIIrd\nVoices: Brian,Ivy,Justin,Russell,Nicole,Emma,Amy,Joanna,Salli,Kimberly,Kendra,Joey,Mizuki,Chantal,Mathieu,Maxim,Raveena',
  permission: [],
  usage: '(voice ;) <message>',
  args: 1,
  command: async function (msg, cmd, args) {
    let Player = global.getPlayer(msg)
    if (!Player) {
      msg.channel.send("You're not in a voice channel!")
      return
    }
    let sound = await textToSpeech(args)
    let item = await Player.play(sound, msg.author)
    if (!item) msg.channel.send('Nothing found!')
    else if (item.error) msg.channel.send(item.error)
    else if (Player.active) Player.msgQueued(msg, item)
  }
}

async function textToSpeech (args) {
  let voice = 'Justin'
  if (args[1] === ';') {
    voice = args[0]
    args.splice(0, 2)
  }
  try {
    let url = 'https://us-central1-sunlit-context-217400.cloudfunctions.net/streamlabs-tts'
    let body = (await got(url, {
      method: 'POST',
      body: {
        voice: voice,
        text: args.join(' ')
      },
      json: true
    })).body
    if (!body.success) return { error: 'Something went wrong!' }
    return {
      type: 'url',
      url: body.speak_url,
      title: args.join(' ')
    }
  } catch (e) {
    return { error: 'Something went wrong!' }
  }
}
