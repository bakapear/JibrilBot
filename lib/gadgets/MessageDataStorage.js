let store = {}
function storeMsg (msg) {
  if (msg.author.bot) return
  if (!Object.prototype.hasOwnProperty.call(store, msg.author.id)) {
    store[msg.author.id] = {
      name: msg.author.username,
      disc: msg.author.discriminator,
      img: msg.author.avatarURL,
      track: { times: 0, chars: 0, words: 0 }
    }
  }
  let user = store[msg.author.id]
  let content = msg.content || ''
  user.track.times++
  user.track.chars += content.length
  user.track.words += content.split(' ').length
}

module.exports = {
  disabled: true,
  type: 'msg',
  check: async msg => {
    storeMsg(msg)
  }
}
