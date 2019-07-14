let fs = require('fs')
let path = require('path')

module.exports = {
  name: ['help', '?', 'cmds'],
  desc: "Shows you the usage of a specific command. If no arguments given, it'll show you a list of all available commands to you.",
  permission: '',
  usage: '(command)',
  args: 0,
  command: async function (msg, cmd, args) {
    let files = await getFileInfo(path.join(__dirname, '/../'), msg.guild.id)
    let cats = {}
    for (let file of files) {
      if (file.data.name.includes(args.join(' '))) {
        msg.channel.send({
          embed: {
            color: 1283187,
            title: `${file.name} [${file.data.name.sort().join(',')}]`,
            description: `${file.data.desc}\n\nUsage: \`${msg.content[0]}${args.join(' ')} ${file.data.usage}\``
          }
        })
        return
      }
      if (!cats[file.type]) cats[file.type] = []
      cats[file.type].push(`\`${file.data.name.sort().join(',')}\``)
    }
    if (args.length >= 1) {
      msg.channel.send(`Couldn't find the command \`${args.join(' ')}\`.`)
      return
    }
    let fields = []
    for (let cat in cats) {
      fields.push({
        name: cat + ` (${cats[cat].length})`,
        value: cats[cat].join(' | ')
      })
    }
    msg.channel.send({
      embed: {
        color: 1283187,
        title: `Commands (${files.length})`,
        description: `Usage: \`${msg.content[0]}help <command>\``,
        fields: fields
      }
    })
  }
}

async function getFileInfo (dir, guild) {
  let files = getAllFiles(dir)
  let data = []
  for (let i = 0; i < files.length; i++) {
    let arr = files[i].split('\\')
    if (arr.length === 1) arr = arr[0].split('/')
    let file = require(`${files[i]}`)
    if (file.guilds && file.guilds.length && !file.guilds.includes(guild)) continue
    data.push({ name: arr.pop().slice(0, -3), type: arr.pop(), data: file })
  }
  return data
}

function getAllFiles (dir) {
  return fs.readdirSync(dir).reduce((files, file) => {
    let name = path.join(dir, file)
    let isDirectory = fs.statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
  }, [])
}
