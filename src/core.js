let cfg = {
  avatars: [],
  img: 'https://cbullet.us/1HR7.png',
  prefix: {
    random: '.',
    hidden: ',',
    first: '-'
  }
}
if (process.env.DEBUG) {
  cfg.prefix = {
    random: '!',
    hidden: '?',
    first: '%'
  }
}
let Discord = require('discord.js')
let path = require('path')
let fs = require('fs')
let bot = new Discord.Client()
let MusicPlayer = require('./modules/MusicPlayer')
let GadgetManager = require('./modules/GadgetManager.js')

global.Player = {}
global.bot = bot
global.cfg = cfg
global.getPlayer = (msg, checkOnly) => {
  let Player = global.Player
  if (checkOnly) return Object.prototype.hasOwnProperty.call(Player, msg.guild.id) && Player[msg.guild.id].connection ? Player[msg.guild.id] : null
  if (Object.prototype.hasOwnProperty.call(Player, msg.guild.id)) return Player[msg.guild.id]
  else {
    if (!msg.member.voiceChannel) return null
    let Player = new MusicPlayer(msg, 4360181)
    Player.on('play', item => Player.msgPlaying(Player.msg, item))
    global.Player[msg.guild.id] = Player
    return Player
  }
}

bot.on('ready', async () => {
  console.info(`Your personal servant ${bot.user.tag} is waiting for orders!`)
  bot.user.setPresence({ game: { name: 'someone else', type: 2 } })
  await GadgetManager.pass('bot', bot)
})

bot.on('message', async msg => {
  if (msg.author.id === bot.user.id) return
  if (await GadgetManager.pass('msg', msg)) return
  if (!startsWithPrefix(msg.content)) return
  if (msg.content.startsWith(cfg.prefix.hidden)) {
    msg.content = msg.content.replace(cfg.prefix.hidden, cfg.prefix.first)
    msg.delete()
  }
  let args = msg.content.split(' ')
  let cmd = args.shift().substr(1).toLowerCase()
  handleCommand(msg, cmd, args)
})

process.on('SIGINT', () => {
  bot.destroy()
  process.exit()
})

bot.on('error', err => console.error('Bot error:', err))
process.on('uncaughtException', err => console.error('Uncaught Exception:', err))
process.on('unhandledRejection', err => console.error('Unhandled Rejection:', err))

function handleCommand (msg, cmd, args) {
  let files = getFileData(path.join(__dirname, 'cmds'))
  for (let i = 0; i < files.length; i++) {
    if (files[i].guilds && files[i].guilds.length && !files[i].guilds.includes(msg.guild.id)) continue
    if (files[i].name.includes(cmd)) {
      if (files[i].permission !== '' && !msg.member.permissions.has(files[i].permission)) {
        msg.channel.send('Invalid permissions!')
        return
      }
      if (files[i].args > args.length) {
        msg.channel.send(`Usage: \`${msg.content[0]}${cmd} ${files[i].usage}\``)
        return
      }
      if (!msg.member) {
        msg.member = {}
        msg.member.voiceChannel = null
      }
      files[i].command(msg, cmd, args)
      return
    }
  }
}

function getFileData (dir) {
  let files = getAllFiles(dir)
  let data = []
  for (let i = 0; i < files.length; i++) {
    data.push(require(`${files[i]}`))
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

function startsWithPrefix (text) {
  let prefixes = Object.keys(cfg.prefix).map(x => cfg.prefix[x])
  let pass = false
  for (let i = 0; i < prefixes.length; i++) {
    if (text.startsWith(prefixes[i])) pass = true
  }
  return pass
}

bot.login(process.env.BOT_TOKEN)
