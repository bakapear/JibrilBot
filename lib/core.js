const Discord = require("discord.js")
let fs = require("fs")
let got = require("got")
let cheerio = require("cheerio")
let cleverbot = require('cleverbot.io')
let ytdl = require("ytdl-core")
let WebSocket = require("ws")
let path = require("path")

global.bot = new Discord.Client()
global.boot = new Date()
global.lockChannel = null
global.token_trivia = {}
global.voice = {}
global.avatars = []
global.checks = [
	msg => { //1
		if (!msg.content.split(" ").slice(1).length) {
			msg.channel.send("Invalid arguments!")
			return true
		}
	},
	msg => { //2
		if (!msg.member.voiceChannel) {
			if (msg.author.bot) msg.channel.send("I'm not in a voice channel!")
			else msg.channel.send("You're not in a voice channel!")
			return true
		}
	},
	msg => { //4
		if (!voice[msg.guild.id].chan) {
			msg.channel.send("I'm not in a voice channel!")
			return true
		}
	}
]
bot.login("NDQyNjg4NjEwODY5ODM3ODI1.DrOJTA.boZ1RS0yI1B_7F01rG0PfiDa5jk")

bot.on("ready", async () => {
	avatars = await getAvatars()
	rndPresence()
	console.log(`Your personal servant ${bot.user.tag} is waiting for orders!`)
})


async function getAvatars() {
	let url = "http://www.google.com/search?tbm=isch&q=osu+avatar+girl&tbs=isz%3Ai"
	let body = (await got(url, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
		}
	})).body
	let $ = cheerio.load(body)
	let meta = $(".rg_meta")
	let result = []
	for (let i = 0; i < meta.length; i++) result.push(JSON.parse(meta[i].children[0].data).ou)
	return result
}

async function rndPresence() {
	let url = "http://api.urbandictionary.com/v0/random"
	let word = (await got(url, { json: true })).body.list[0].word
	if (word) bot.user.setPresence({ game: { name: word.substring(0, 25), type: Math.floor(Math.random() * 4) } })
}

function rndAvatar() {
	bot.user.setAvatar(avatars[Math.floor(Math.random() * avatars.length)])
}

//Change presence every 10mins~
setInterval(rndPresence, 654321)

//Change avatar every 10mins~
setInterval(rndAvatar, 654321)

bot.on("message", async msg => {
	if (!voice.hasOwnProperty(msg.guild.id)) {
		voice[msg.guild.id] = {
			chan: null,
			conn: null,
			disp: null,
			queue: null,
			skip: null,
			msg: null,
			paused: null,
			repeat: null
		}
	}
	if (msg.content.startsWith(`<@${bot.user.id}>`)) {
		msg.channel.startTyping()
		let content = msg.content.slice(21)
		let cbot = new cleverbot(process.env.CBOT_USER, process.env.CBOT_KEY)
		cbot.setNick(msg.author.username)
		cbot.create(function (err, session) {
			cbot.ask(content, function (err, response) {
				msg.channel.send(response)
				msg.channel.stopTyping()
			})
		})
		return
	}
	if (!(msg.content.startsWith(".") || msg.content.startsWith(",") || msg.content.startsWith("-"))) return
	if (msg.content.startsWith(",")) {
		msg.content = msg.content.replace(",", ".")
		msg.delete()
	}
	let args = msg.content.slice(1).split(" ")
	let cmd = args.shift().toLowerCase()
	getFileData(__dirname + "/cmds").then(files => {
		for (let i = 0; i < files.length; i++) {
			if (files[i].name.includes(cmd)) {
				if (lockChannel !== null && msg.channel !== lockChannel && msg.content !== ".cmdlock") {
					msg.channel.send("Commands only available in #" + lockChannel.name).then(m => {
						m.delete(2000)
						msg.delete(2000)
					})
					return
				}
				if (files[i].permission !== "" && !msg.member.permissions.has(files[i].permission)) {
					msg.channek.send("Invalid permissions!")
					return
				}
				if (files[i].args > args.length) {
					msg.channel.send(`Usage: \`.${cmd} ${files[i].usage}\``)
					return
				}
				if (!msg.member) {
					msg.member = {}
					msg.member.voiceChannel = voice[msg.guild.id].chan
				}
				files[i].command(msg, cmd, args)
				return
			}
		}
	})
})


process.on('uncaughtException', err => {
	console.log('Uncaught Exception: ' + err)
})

process.on('unhandledRejection', err => {
	console.log('Unhandled Rejection: ' + err)
})


async function getFileData(dir) {
	let files = getAllFiles(dir)
	let data = []
	for (let i = 0; i < files.length; i++) {
		data.push(require(`${files[i]}`))
	}
	return data
}

function getAllFiles(dir) {
	return fs.readdirSync(dir).reduce((files, file) => {
		const name = path.join(dir, file)
		const isDirectory = fs.statSync(name).isDirectory()
		return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
	}, [])
}

playQueue = (msg) => {
	if (voice[msg.guild.id].queue[0].type === "yt") {
		voice[msg.guild.id].disp = voice[msg.guild.id].conn.playStream(ytdl(voice[msg.guild.id].queue[0].id, { audioonly: true, begin: voice[msg.guild.id].queue[0].time }))
	} else {
		voice[msg.guild.id].disp = voice[msg.guild.id].conn.playArbitraryInput(voice[msg.guild.id].queue[0].link)
	}
	voice[msg.guild.id].disp.on('start', () => {
		voice[msg.guild.id].conn.player.streamingData.pausedTime = 0
	})
	addEndEvent(msg)
	if (voice[msg.guild.id].queue[0].type === "radio") {
		let kpop = false
		let url = "wss://listen.moe/gateway"
		if (voice[msg.guild.id].queue[0].name.indexOf("kpop") >= 0) kpop = true
		if (kpop) url = "wss://listen.moe/kpop/gateway"
		let ws = new WebSocket(url)
		ws.on("open", () => ws.send(JSON.stringify({ op: 2 })))
		ws.on("message", (data) => {
			data = JSON.parse(data)
			let img = voice[msg.guild.id].queue[0].img
			if (data.d.song.artists[0].image) img = "https://cdn.listen.moe/artists/" + data.d.song.artists[0].image
			showPlayMessage(voice[msg.guild.id].msg, "Now Streaming listen.moe " + (kpop ? "KPOP" : "JPOP"), (data.d.song.artists.map(x => x.name).join(", ")) + " - " + data.d.song.title, "https://listen.moe/", img)
			ws.close()
		})
	}
	else {
		showPlayMessage(voice[msg.guild.id].msg, "Now Playing", voice[msg.guild.id].queue[0].name, voice[msg.guild.id].queue[0].link, voice[msg.guild.id].queue[0].img, voice[msg.guild.id].queue[0].duration)
	}
}

showPlayMessage = (msg, title, desc, url, img, dur) => {
	let chan = msg.channel
	if (dur) title += " (" + dur + ")"
	chan.send({
		embed: {
			color: 14506163,
			title: title,
			description: desc,
			url: url,
			thumbnail: {
				url: img
			}
		}
	})
}

addEndEvent = (msg) => {
	voice[msg.guild.id].disp.on("end", () => {
		if (voice[msg.guild.id].skip) {
			voice[msg.guild.id].skip = false
			return
		}
		voice[msg.guild.id].disp = null
		setTimeout(() => {
			if (!voice[msg.guild.id].queue) return
			if (voice[msg.guild.id].repeat) {
				voice[msg.guild.id].queue.push(voice[msg.guild.id].queue.shift())
			} else voice[msg.guild.id].queue.shift()
			if (!voice[msg.guild.id].queue.length) {
				voice[msg.guild.id].paused = null
				voice[msg.guild.id].disp = null
				voice[msg.guild.id].queue = null
				voice[msg.guild.id].skip = null
				voice[msg.guild.id].msg = null
				voice[msg.guild.id].repeat = null
				return
			}
			playQueue(msg)
		}, 1500)
	})
}

doChecks = (checks, stuff, val) => {
	if (!val) return []
	let arr = []
	for (let i = 0, bit = 1; i < checks.length; i++) {
		if (bit & val) arr.push(checks[i](stuff))
		bit = bit << 1
	}
	return arr.some(x => x === true)
}