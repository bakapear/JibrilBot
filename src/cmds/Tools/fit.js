let jimp = require('jimp')

module.exports = {
  name: ['fit'],
  desc: 'Resizes the image in your last message (or current) to appear in a higher preview quality.',
  permission: '',
  usage: '(url)',
  args: 0,
  command: async function (msg, cmd, args) {
    let url = ''
    let msgs = await msg.channel.fetchMessages().then(msgs => msgs.filter(m => m.author.id === msg.author.id))
    msgs = msgs.array()
    let last = msgs[1]
    if (msgs[0].attachments.size || msgs[0].embeds.length || args.length > 0) last = msgs[0]
    if (last.embeds.length) {
      let embed = last.embeds.find(x => x.type === 'image' && x.url)
      if (embed) url = embed.url
    } else if (last.attachments.size) {
      let attach = last.attachments.find(x => x.filename.match(/\.(png|jpg|webp|jpeg)/) && x.url)
      if (attach) url = attach.url
    }
    if (!url) return msg.channel.send('Nothing there to fit!')
    let data = await fit(url)
    msg.channel.send({ file: data })
  }
}

async function fit (url) {
  let img = await jimp.read(url)
  let size = getSize(img.bitmap.width, img.bitmap.height)
  if (size.width && size.height) img.scaleToFit(size.width, size.height)
  let res = await img.getBufferAsync(jimp.AUTO)
  return res
}

function getRatio (width, height, maxWidth, maxHeight) {
  let o = 1
  let a = (width > maxWidth && (o = maxWidth / width), (width = Math.round(width * o)))
  a = 1
  return ((height = Math.round(height * o)) > maxHeight && (a = maxHeight / height), Math.min(o * a, 1))
}

function isGood (width, height) {
  let ratio = getRatio(width, height, 400, 300)
  let srcWidth = Math.ceil(width * ratio)
  let srcHeight = Math.ceil(height * ratio)
  let destWidth = Math.round(width * ratio)
  let destHeight = Math.round(height * ratio)
  return srcWidth === destWidth && srcHeight === destHeight
}

function getSize (width, height) {
  if (isGood(width, height)) return {}
  for (let w = width - 1; w > 0; --w) {
    if (isGood(w, height)) return { width: w, height: height }
  }
  for (let h = height - 1; h > 0; --h) {
    if (isGood(width, h)) return { width: width, height: h }
  }
}
