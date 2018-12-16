let Discord = require("discord.js")
let fs = require("fs")
let got = require("got")
let cheerio = require("cheerio")
let ytdl = require("ytdl-core")
let WebSocket = require("ws")
let path = require("path")
let replika = {
	token: process.env.API_REPLIKA_TOKEN,
	user: process.env.API_REPLIKA_USER,
	device: process.env.API_REPLIKA_DEVICE,
	key: process.env.API_REPLIKA_KEY,
	bot: process.env.API_REPLIKA_BOT,
	chat: process.env.API_REPLIKA_CHAT
}

//global vars
bot = new Discord.Client()
voice = {}
cfg = {}
checks = [
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

//bot events
bot.login(process.env.BOT_TOKEN)
bot.on("ready", async () => {
	cfg.prefix = {
		random: ".",
		hidden: ",",
		first: "-",
		mention: `<@${bot.user.id}>`
	}
	cfg.avatars = await getAvatars()
	setInterval(rndPresence, 654321)
	setInterval(rndAvatar, 654321)
	midnightMessage()
	console.info(`Your personal servant ${bot.user.tag} is waiting for orders!`)
	bot.user.setPresence({ game: { name: "pear", type: 2 } })
})
bot.on("message", async msg => {
	if (!startsWithPrefix(msg.content)) return
	if (msg.content.startsWith(cfg.prefix.mention)) {
		if (!msg.author.bot) {
			await talkToReplika(msg)
			return
		}
	}
	if (msg.content.startsWith(cfg.prefix.hidden)) {
		msg.content = msg.content.replace(cfg.prefix.hidden, cfg.prefix.first)
		msg.delete()
	}
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
	let args = msg.content.slice(1).split(" ")
	let cmd = args.shift().toLowerCase()
	handleCommand(msg, cmd, args)
})

//error handling
bot.on("error", err => console.error("Bot error: " + err))
process.on("uncaughtException", err => console.error("Uncaught Exception: " + err))
process.on("unhandledRejection", err => console.error("Unhandled Rejection: " + err))

function midnightMessage() {
	setTimeout(() => {
		console.info("Midnight")
		midnightMessage()
	}, getMidnightTime())
}
function getMidnightTime() {
	let old = new Date()
	let date = new Date()
	date.setDate(date.getDate() + 1)
	date.setSeconds(0)
	date.setMinutes(0)
	date.setHours(0)
	return date - old
}

//functions
function handleCommand(msg, cmd, args) {
	let files = getFileData(__dirname + "/cmds")
	for (let i = 0; i < files.length; i++) {
		if (files[i].name.includes(cmd)) {
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
}
function startsWithPrefix(text) {
	let prefixes = Object.keys(cfg.prefix).map(x => cfg.prefix[x])
	let pass = false
	for (let i = 0; i < prefixes.length; i++) {
		if (text.startsWith(prefixes[i])) pass = true
	}
	return pass
}
function getFileData(dir) {
	let files = getAllFiles(dir)
	let data = []
	for (let i = 0; i < files.length; i++) {
		data.push(require(`${files[i]}`))
	}
	return data
}
function getAllFiles(dir) {
	return fs.readdirSync(dir).reduce((files, file) => {
		let name = path.join(dir, file)
		let isDirectory = fs.statSync(name).isDirectory()
		return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
	}, [])
}
async function talkToReplika(msg) {
	let text = msg.content.substr(`<@${bot.user.id}>`.length).trim()
	if (!text) {
		let url = "https://my.replika.ai/api/mobile/0.8/bots/" + replika.bot
		let body = (await got(url, {
			headers: {
				"x-auth-token": replika.key,
				"x-user-id": replika.user,
				"x-device-id": replika.device
			},
			json: true
		})).body
		msg.channel.send({
			embed: {
				title: body.name,
				color: 6508963,
				description: `**Mood:** ${body.mood.title} (${body.mood.happiness_level})\n**Level:** ${body.stats.current_level.level_index} (${body.stats.current_level.name})\n**XP:** ${body.stats.score} (->${body.stats.next_level.score_milestone})`,
				thumbnail: {
					url: body.icon_large_url
				}
			}
		})
		return
	}
	let ws = new WebSocket("wss://my.replika.ai:8050/v9")
	let s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
	let guid = s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
	let body = {
		event_name: "message",
		payload: {
			content: { type: "text", text: text },
			meta: {
				bot_id: replika.bot,
				client_token: guid,
				chat_id: replika.chat,
				timestamp: new Date().toISOString()
			}
		},
		token: replika.token,
		auth: {
			user_id: replika.user,
			device_id: replika.device,
			auth_token: replika.key
		}
	}
	let heart
	ws.on("open", () => { ws.send(JSON.stringify(body)) })
	ws.on("message", data => {
		if (heart) clearInterval(heart)
		data = JSON.parse(data)
		if (data.event_name === "start_typing") msg.channel.startTyping()
		else if (data.event_name === "message" && data.payload && data.payload.meta && data.payload.meta.nature === "Robot") {
			msg.channel.stopTyping()
			msg.channel.send(data.payload.content.text)
			if (data.payload.widget) {
				let items = data.payload.widget.items
				let txt = []
				for (let i = 0; i < items.length; i++) {
					txt.push("`" + items[i].title + "`")
				}
				msg.channel.send(txt.join(" "))
			}
		}
		heart = setInterval(() => ws.close(), 15000)
	})
}
async function getAvatars() {
	let url = "https://raw.githubusercontent.com/bakapear/osuavatars/master/data.json"
	let body = (await got(url, { json: true })).body
	return body.items.map(x => body.url + x)
}
async function rndPresence() {
	let url = "http://api.urbandictionary.com/v0/random"
	let word = (await got(url, { json: true })).body.list[0].word
	if (word) bot.user.setPresence({ game: { name: word.substring(0, 25), type: Math.floor(Math.random() * 4) } })
}
function rndAvatar() {
	let img = cfg.avatars[Math.floor(Math.random() * cfg.avatars.length)]
	bot.user.setAvatar(img)
}

//global functions
playQueue = async msg => {
	if (voice[msg.guild.id].queue[0].type === "yt") {
		voice[msg.guild.id].disp = voice[msg.guild.id].conn.playStream(ytdl(voice[msg.guild.id].queue[0].id, { audioonly: true, begin: voice[msg.guild.id].queue[0].time }))
	}
	else if (voice[msg.guild.id].queue[0].type === "base64") {
		let spk = Buffer.from(voice[msg.guild.id].queue[0].data, "base64")
		let path = "lib/data/temp/" + msg.guild.id + ".wav"
		await fs.writeFileSync(path, spk)
		voice[msg.guild.id].disp = voice[msg.guild.id].conn.playFile(path)
	}
	else {
		voice[msg.guild.id].disp = voice[msg.guild.id].conn.playArbitraryInput(voice[msg.guild.id].queue[0].link)
	}
	voice[msg.guild.id].disp.on("start", () => {
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
addEndEvent = msg => {
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