let jimp = require('jimp')

module.exports = {
  name: ['triggered'],
  desc: 'Puts triggered below an image.',
  permission: '',
  usage: '<url>',
  args: 1,
  command: async function (msg, cmd, args) {
    try {
      let img = await jimp.read(args[0])
      let src = await jimp.read('./lib/data/assets/triggered.jpg')
      src.scaleToFit(img.bitmap.width, jimp.AUTO)
      img.contain(img.bitmap.width, img.bitmap.height + src.bitmap.height, jimp.VERTICAL_ALIGN_TOP)
      img.composite(src, 0, img.bitmap.height - src.bitmap.height)
      img.color([{ apply: 'saturate', params: [100] }])
      let file = `./lib/data/temp/triggered_${msg.author.id}.jpg`
      img.write(file, function (err) {
        if (err) {
          msg.channel.send('Something went wrong!')
          return
        }
        msg.channel.send({ file: file })
      })
    } catch (e) { msg.channel.send('Something went wrong!') }
  }
}
