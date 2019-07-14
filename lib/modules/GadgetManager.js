let fs = require('fs')
let path = require('path')

let gadgetPath = path.join(__dirname, '/../', 'gadgets')
let files = fs.readdirSync(gadgetPath)
let data = files.map(file => require(path.join(gadgetPath, file)))

async function pass (type, arg) {
  let passes = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].type === type && !data[i].disabled) passes.push(data[i].check(arg))
  }
  passes = await Promise.all(passes)
  return passes.some(x => x)
}

module.exports = {
  pass: pass
}
