let { cfg } = global
let got = require('got')

module.exports = {
  name: ['color'],
  desc: 'Displays a color. If no color is given, a random one will be chosen. If you put a # infront it will convert it to RGB and if you put 3 numbers it will give you the hex value of those.',
  permission: '',
  usage: '(color/#hex/r g b)',
  args: 0,
  command: async function (msg, cmd, args) {
    let link = `http://www.colourlovers.com/api/colors?format=json&keywords=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`
    if (args === '') link = `http://www.colourlovers.com/api/colors/random?format=json`
    else if (args[0].startsWith('#')) {
      if (hexToRgb(args[0].substring(1)) === null) {
        msg.channel.send('Invalid hex!')
        return
      }
      let c = hexToRgb(args[0].substring(1))
      let hex = args[0].substring(1)
      msg.channel.send({
        embed: {
          color: (c.r << 16) + (c.g << 8) + (c.b),
          title: args[0],
          description: `**Hex** #${hex}\n**R** ${c.r} **G** ${c.g} **B** ${c.b}`,
          image: {
            url: `https://www.colorhexa.com/${hex}.png`
          }
        }
      })
      return
    } else if (args.split(',').every(x => !isNaN(x))) {
      let [ r, g, b ] = args.split(',').map(x => parseInt(x))
      if ((r < 0 || r > 255) || (g < 0 || g > 255) || (b < 0 || b > 255)) {
        msg.channel.send('Invalid rgb!')
        return
      }
      let hex = rgbToHex(r, g, b).substr(1)
      msg.channel.send({
        embed: {
          color: (r << 16) + (g << 8) + (b),
          title: args[0],
          description: `**Hex** #${hex}\n**R** ${r} **G** ${g} **B** ${b}`,
          image: {
            url: `https://www.colorhexa.com/${hex}.png`
          }
        }
      })
      return
    }
    let body = (await got(link, { json: true })).body
    if (body.length < 1) {
      msg.channel.send('Nothing found!')
      return
    }
    let mod = msg.content.startsWith(cfg.prefix.random) ? Math.floor(Math.random() * body.length) : 0
    msg.channel.send({
      embed: {
        color: (body[mod].rgb.red << 16) + (body[mod].rgb.green << 8) + (body[mod].rgb.blue),
        title: body[mod].title,
        description: `**Hex** #${body[mod].hex}\n**R** ${body[mod].rgb.red} **G** ${body[mod].rgb.green} **B** ${body[mod].rgb.blue}\n**H** ${body[mod].hsv.hue} **S** ${body[mod].hsv.saturation} **V** ${body[mod].hsv.value}`,
        image: {
          url: body[mod].imageUrl
        }
      }
    })
  }
}
function componentToHex (c) {
  let hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function rgbToHex (r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

function hexToRgb (hex) {
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}
