let got = require('got')
let token = null

module.exports = {
  name: ['trivia'],
  desc: 'Asks questions, you should prolly answer.',
  permission: '',
  usage: '(question)',
  args: 0,
  command: async function (msg, cmd, args) {
    if (!token) {
      let url = 'https://opentdb.com/api_token.php?command=request'
      let body = (await got(url, { json: true })).body
      token = body.token
    }
    let url = 'https://opentdb.com/api.php?amount=1&encode=url3986&token=' + token
    let body = (await got(url, { json: true })).body
    if (body.response_code !== 0) {
      msg.channel.send('Something went wrong!')
      return
    }
    if (body.results.length < 1) {
      msg.channel.send('No questions found?!')
      return
    }
    let answers = decodeURIComponent(body.results[0].incorrect_answers.concat(body.results[0].correct_answer)).split(',').sort()
    let filter = (r, u) => true
    if (body.results[0].type === 'boolean') answers = answers.reverse()
    switch (answers.length) {
      case 2: {
        filter = (r, u) => (
          r.emoji.name === '1⃣' ||
          r.emoji.name === '2⃣') && u.id === msg.author.id
        break
      }
      case 3: {
        filter = (r, u) => (
          r.emoji.name === '1⃣' ||
          r.emoji.name === '2⃣' ||
          r.emoji.name === '3⃣') && u.id === msg.author.id
        break
      }
      case 4: {
        filter = (r, u) => (
          r.emoji.name === '1⃣' ||
          r.emoji.name === '2⃣' ||
          r.emoji.name === '3⃣' ||
          r.emoji.name === '4⃣') && u.id === msg.author.id
        break
      }
      case 5: {
        filter = (r, u) => (
          r.emoji.name === '1⃣' ||
          r.emoji.name === '2⃣' ||
          r.emoji.name === '3⃣' ||
          r.emoji.name === '4⃣' ||
          r.emoji.name === '5⃣') && u.id === msg.author.id
        break
      }
      case 6: {
        filter = (r, u) => (
          r.emoji.name === '1⃣' ||
          r.emoji.name === '2⃣' ||
          r.emoji.name === '3⃣' ||
          r.emoji.name === '4⃣' ||
          r.emoji.name === '5⃣' ||
          r.emoji.name === '6⃣') && u.id === msg.author.id
        break
      }
      case 7: {
        filter = (r, u) => (
          r.emoji.name === '1⃣' ||
          r.emoji.name === '2⃣' ||
          r.emoji.name === '3⃣' ||
          r.emoji.name === '4⃣' ||
          r.emoji.name === '5⃣' ||
          r.emoji.name === '6⃣' ||
          r.emoji.name === '7⃣') && u.id === msg.author.id
        break
      }
      case 8: {
        filter = (r, u) => (
          r.emoji.name === '1⃣' ||
          r.emoji.name === '2⃣' ||
          r.emoji.name === '3⃣' ||
          r.emoji.name === '4⃣' ||
          r.emoji.name === '5⃣' ||
          r.emoji.name === '6⃣' ||
          r.emoji.name === '7⃣' ||
          r.emoji.name === '8⃣') && u.id === msg.author.id
        break
      }
    }
    let options = ''
    for (let i = 0; i < answers.length; i++) {
      options += `**${i + 1}.** ${answers[i]}\n`
    }
    let colorint = 0
    switch (body.results[0].difficulty) {
      case 'easy': {
        colorint = 4980605
        break
      }
      case 'medium': {
        colorint = 16742455
        break
      }
      case 'hard': {
        colorint = 16727100
        break
      }
    }
    let reactions = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣']
    msg.channel.send({
      embed: {
        color: colorint,
        title: decodeURIComponent(body.results[0].question),
        description: options
      }
    }).then(async m => {
      for (let i = 0; i < answers.length; i++) {
        await m.react(reactions[i])
      }
      let collector = m.createReactionCollector(filter, { time: 300000 }).on('collect', r => {
        collector.stop()
        m.clearReactions()
      })
      collector.on('end', (collected) => {
        let pick
        let num
        switch (collected.lastKey()) {
          case '1⃣': {
            pick = answers[0]
            num = 1
            break
          }
          case '2⃣': {
            pick = answers[1]
            num = 2
            break
          }
          case '3⃣': {
            pick = answers[2]
            num = 3
            break
          }
          case '4⃣': {
            pick = answers[3]
            num = 4
            break
          }
          case '5⃣': {
            pick = answers[4]
            num = 5
            break
          }
          case '6⃣': {
            pick = answers[5]
            num = 6
            break
          }
          case '7⃣': {
            pick = answers[6]
            num = 7
            break
          }
          case '8⃣': {
            pick = answers[7]
            num = 8
            break
          }
        }
        let title
        let desc
        if (pick === decodeURIComponent(body.results[0].correct_answer)) {
          title = `✅ Right Answer!`
          desc = `Got the right answer! (${num})`
        } else {
          title = `❎ Wrong Answer!`
          desc = `Got the wrong answer! (${num})`
        }
        options = ''
        for (let i = 0; i < answers.length; i++) {
          if (answers[i] === decodeURIComponent(body.results[0].correct_answer)) options += `**${i + 1}.** \`${answers[i]}\`\n`
          else options += `**${i + 1}.** ${answers[i]}\n`
        }
        m.edit({
          embed: {
            color: colorint,
            title: decodeURIComponent(body.results[0].question),
            description: options,
            fields: [
              {
                name: title,
                value: desc
              }
            ]
          }
        })
      })
    })
  }
}
