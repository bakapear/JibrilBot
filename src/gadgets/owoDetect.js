let uwus = [
  'Hold your horses there pal, did %PLAYER% just heckin\' %TYPE%\'d?!',
  'Oi mate, I saw %PLAYER% %TYPE%ing there! What a wanker.',
  'Bro, did %PLAYER% just %TYPE%?',
  'Okay %PLAYER%, what\'s up with those %TYPE%\'s?',
  'Oh frick, did %PLAYER% just do the naughty %TYPE%?!',
  'Oh noe, did %PLAYER% just do the forbidden %TYPE%? Unbelievable.',
  'Dang. %PLAYER% just did the %TYPE% on us.',
  'I was just casually watching videos until %PLAYER% %TYPE%ed in here.',
  'What in the actual %TYPE%. %PLAYER% are you crazy?!',
  '%PLAYER%: %TYPE%\nme: >:c',
  '*breathes in* %PLAYER% WHY DID YOU %TYPE% HERE?!!',
  'Am I a joke to you or why does %PLAYER% do some %TYPE%ing here and there?',
  'One Two Seven Three, %PLAYER% just %TYPE%ed on me~',
  'SO NO CHI NO %TYPE% ME! Isn\'t that right, %PLAYER%?',
  'MISSION FAILED - %PLAYER% will %TYPE% \'em next time.',
  '%PLAYER% has been declared guilty of %TYPE%ing.',
  'Everyone:\n%PLAYER%: %TYPE%',
  'Girls run! This pervert %PLAYER% just %TYPE%ed!!',
  'It\'s a %PLAYER% thing. You wouldn\'t %TYPE%stand.',
  'Super %PLAYER% Brothers: %TYPE%! (Now available for purchase!)',
  'We do not tolerate the use of %TYPE%, %PLAYER%...',
  'xX_%TYPE%_ %PLAYER%_%TYPE%_Xx tried to swim in lava.',
  'Gotta %TYPE% fast, just like %PLAYER%.',
  'That\'s a +1 on the %TYPE% database, %PLAYER%.',
  '%PLAYER%! No advertising of %TYPE%.com!!',
  'Hey %PLAYER%, wanna play osu? I heard a new beatmap called %TYPE%Girl just got ranked!',
  '"No! I dun do things for sluts :3" - Is a quote %PLAYER% would %TYPE% on.'
]

function respond (msg, type) {
  let rnd = Math.floor(Math.random() * uwus.length)
  let txt = uwus[rnd]
    .replace(/%PLAYER%/g, `<@${msg.author.id}>`)
    .replace(/%TYPE%/g, type)
  msg.channel.send(txt)
}

module.exports = {
  disabled: false,
  type: 'msg',
  check: async msg => {
    if (msg.author.bot) return false
    let txt = msg.content.toLowerCase()
    if (txt.indexOf('owo') >= 0) respond(msg, 'owo')
    else if (txt.indexOf('uwu') >= 0) respond(msg, 'uwu')
    return false
  }
}
