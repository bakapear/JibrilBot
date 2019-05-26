let got = require('got')
let apiMusix = process.env.API_MUSIX

module.exports = {
  name: ['mlyrics'],
  desc: 'Gives you the entire lyrics of a song! (old)',
  permission: '',
  usage: '<lyrics/song>',
  args: 1,
  command: async function (msg, cmd, args) {
    let url = `http://api.musixmatch.com/ws/1.1/track.search?q_track_artist=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&page_size=3&page=1&s_track_rating=desc&apikey=${apiMusix}`
    let body = (await got(url, { json: true })).body
    if (body.message.header.available < 1) {
      msg.channel.send('Nothing found!')
      return
    }
    let tracktitle = `${body.message.body.track_list[0].track.artist_name} - ${body.message.body.track_list[0].track.track_name}`
    url = `http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${body.message.body.track_list[0].track.track_id}&apikey=${apiMusix}`
    body = (await got(url, { json: true })).body
    if (body.message.header.status_code === 404) {
      msg.channel.send('Nothing found!')
      return
    }
    msg.channel.send({
      embed: {
        color: 14024703,
        title: tracktitle,
        description: body.message.body.lyrics.lyrics_body.slice(0, -70).substring(0, 1020)
      }
    })
  }
}
