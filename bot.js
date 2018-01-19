const Discord = require("discord.js");
const bot = new Discord.Client();
const request = require("request");
var cfg = "";

var api_google = process.env.API_GOOGLE;
var api_giphy = process.env.API_GIPHY;
var api_search = process.env.API_SEARCH;
var api_osu = process.env.API_OSU;
var api_steam = process.env.API_STEAM;
var api_github = process.env.API_GITHUB;

var bot_prefix = ".";

if (process.env.BOT_TOKEN != undefined) {
	bot.login(process.env.BOT_TOKEN);
}
else {
	cfg = require("./config.json");
	bot.login(cfg.token);
	api_google = cfg.api.google;
	api_giphy = cfg.api.giphy;
	api_search = cfg.api.search;
	api_osu = cfg.api.osu;
	api_steam = cfg.api.steam;
	api_img = cfg.imgkeys[0].key;
	api_github = cfg.api.github;
}

bot.on("ready", () => {
	console.log(`Your personal servant ${bot.user.tag} is waiting for orders! oWo`);
	bot.user.setPresence({ game: { name: "with master", type: 0 } });
});

bot.on("message", (msg) => {
	if (msg.author.bot || !msg.content.startsWith(bot_prefix)) return;
	const args = msg.content.slice(1).split(" ");
	const cmd = args.shift().toLowerCase();
	switch (cmd) {
		case "note": {
			msg.channel.send("fix imgkeys for heroku");
			msg.channel.send("add .help");
			msg.channel.send("baka, add more api commands oWO");
			msg.channel.send("make radio check if playing (right way)");
			msg.channel.send("dont allow sounds to play while sound is actually playing, desu");
			msg.channel.send(".play error: TypeError: Cannot read property 'send' of null /^ above might fix it");
			msg.channel.send("WORKING AKI, ARIGATO CONASTIEMAS");
			break;
		}
		case "ping": {
			if (args == "help") {
				msg.channel.send("Usage: `.ping`").then(m => {
					m.delete(5000);
				});
				return;
			}
			const date = Date.now();
			msg.channel.send("Pinging...").then(m => {
				const newdate = Date.now() - date;
				if (newdate <= 500) {
					m.edit(`Pong! It took **${newdate}ms**, desu!`);
				}
				else {
					m.edit(`Pong! It took **${newdate}ms**!? Fix it b-baka!`);
				}
			});
			break;
		}
		case "pong": {
			if (args == "help") {
				msg.channel.send("Usage: `.pong`").then(m => {
					m.delete(5000);
				});
				return;
			}
			msg.channel.send("Ping!");
			break;
		}
		case "roll": {
			if (args == "help") {
				msg.channel.send("Usage: `.roll (min value) (max value)`").then(m => {
					m.delete(5000);
				});
				return;
			}
			var max = 6;
			var min = 1;
			if (args.length == 1) {
				max = parseInt(args[0]);
			}
			else if (args.length > 1) {
				min = parseInt(args[0]);
				max = parseInt(args[1]);
			}
			const rnd = Math.floor(Math.random() * (max - min + 1)) + min;
			msg.channel.send(`:game_die: ${msg.author.username} rolled a **${rnd}**!`);
			break;
		}
		case "say": {
			if (args == "") {
				msg.channel.send("Usage: `.say <message>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			msg.delete();
			msg.channel.send(msg.content.slice(cmd.length + 1));
			break;
		}
		case "8ball": {
			switch (Math.floor(Math.random() * (20 - 1 + 1)) + 1) {
				case 1: msg.channel.send(":8ball: It is certain"); break;
				case 2: msg.channel.send(":8ball: It is decidedly so"); break;
				case 3: msg.channel.send(":8ball: Without a doubt"); break;
				case 4: msg.channel.send(":8ball: Yes definitely"); break;
				case 5: msg.channel.send(":8ball: You may rely on it"); break;
				case 6: msg.channel.send(":8ball: As I see it, yes"); break;
				case 7: msg.channel.send(":8ball: Most likely"); break;
				case 8: msg.channel.send(":8ball: Outlook good"); break;
				case 9: msg.channel.send(":8ball: Yes"); break;
				case 10: msg.channel.send(":8ball: Signs point to yes"); break;
				case 11: msg.channel.send(":8ball: Reply hazy try again"); break;
				case 12: msg.channel.send(":8ball: Ask again later"); break;
				case 13: msg.channel.send(":8ball: Better not tell you now"); break;
				case 14: msg.channel.send(":8ball: Cannot predict now"); break;
				case 15: msg.channel.send(":8ball: Concentrate and ask again"); break;
				case 16: msg.channel.send(":8ball: Don't count on it"); break;
				case 17: msg.channel.send(":8ball: My reply is no"); break;
				case 18: msg.channel.send(":8ball: My sources say no"); break;
				case 19: msg.channel.send(":8ball: Outlook not so good"); break;
				case 20: msg.channel.send(":8ball: Very doubtful"); break;
			}
			break;
		}
		case "pick": {
			if (args == "" || args == "help") {
				msg.channel.send("Usage: `.pick <choice1,choice2,choice3...>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			const parts = msg.content.slice(cmd.length + 1).split(",");
			msg.channel.send(parts);
			if (parts.length < 2) { msg.channel.send("Please enter atleast 2 things to choose from!"); return; }
			const rnd = Math.floor(Math.random() * parts.length);
			msg.channel.send(`I chose **${parts[rnd].trim()}**, because why not!`);
			break;
		}
		case "cat": {
			if (args == "help") {
				msg.channel.send("Usage: `.cat`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: "http://random.cat/meow.php",
				json: true
			}, function (error, response, body) {
				msg.channel.send(body.file);
			})
			break;
		}
		case "dog": {
			if (args == "help") {
				msg.channel.send("Usage: `.dog`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://dog.ceo/api/breeds/image/random`,
				json: true
			}, function (error, response, body) {
				msg.channel.send(body.message);
			})
			break;
		}
		case "clear": {
			if (!msg.member.permissions.has("ADMINISTRATOR")) return;
			if (args == "help") {
				msg.channel.send("Usage: `.clear`").then(m => {
					m.delete(5000);
				});
				return;
			}
			msg.channel.fetchMessages()
				.then(msgs => {
					msg.channel.bulkDelete(msgs);
				});
			break;
		}
		case "rate": {
			if (args == "help") {
				msg.channel.send("Usage: `.rate (thing)`").then(m => {
					m.delete(5000);
				});
				return;
			}
			const rnd = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
			if(args == "") {
				msg.channel.send(`Imma give you a **${rnd}/10**!`);
			}
			else {
				msg.channel.send(`${msg.content.slice(cmd.length + 1)} get a **${rnd}/10**!`);
			}
			break;
		}
		case "gif": {
			if (args == "help") {
				msg.channel.send("Usage: `.gif (query)`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `http://api.giphy.com/v1/gifs/random?tag=${args.join("+")}`,
				qs: {
					api_key: api_giphy,
					rating: 'r',
					format: 'json',
					limit: 1
				},
				json: true
			}, function (error, response, body) {
				if (body.data.image_url == undefined) {
					msg.channel.send("Nothing found!");
				}
				else {
					msg.channel.send(body.data.image_url);
				}
			})
			break;
		}
		case "yt": {
			if (args == "" || args == "help") {
				msg.channel.send("Usage: `.yt <query>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://www.googleapis.com/youtube/v3/search?part=id&q=${args.join("+")}`,
				qs: {
					key: api_google
				},
				json: true
			}, function (error, response, body) {
				if (body.items.length < 1) {
					msg.channel.send("Nothing found!");
				}
				else {
					msg.channel.send(`https://www.youtube.com/watch?v=${body.items[0].id.videoId}`);
				}
			})
			break;
		}
		case "img": {
			if (args == "" || args == "help") {
				msg.channel.send("Usage: `.img <query>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			var info = 0;
			if (args[0].startsWith("*")) {
				info = args.splice(0, 1);
			}
			info = parseInt(info.toString().substr(1));
			var key_num = 0;
			var retried = false;
			img(msg, args, key_num, retried, info);
			break;
		}
		case "osu": {
			if (args == "") {
				msg.channel.send("Usage: `.osu <username>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://osu.ppy.sh/api/get_user?u=${args[0]}`,
				qs: {
					k: api_osu
				},
				json: true
			}, function (error, response, body) {
				if (body[0] == undefined) {
					msg.channel.send("User not found!");
				}
				else if (body[0].pp_rank == null) {
					msg.channel.send("No information for that user!");
				}
				else {
					msg.channel.send({
						embed: {
							color: 15033501,
							author: {
								name: `osu! Profile`,
								icon_url: `https://i.imgur.com/oEbzSZU.png`
							},
							title: `${body[0].username} :flag_${body[0].country.toLowerCase()}:`,
							url: `https://osu.ppy.sh/u/${body[0].user_id}`,
							thumbnail: {
								url: `https://a.ppy.sh/${body[0].user_id}`
							},
							fields: [{
								name: `Statistics`,
								value: `**Ranked** #${body[0].pp_rank}\n**PP** ${body[0].pp_raw}pp\n**Accuracy** ${parseFloat(body[0].accuracy).toFixed(2)}%\n**Level** ${body[0].level}\n**Play Count** ${body[0].playcount}`
							},
							{
								name: "Misc",
								value: `**Ranked Score** ${body[0].ranked_score}\n**Total Score** ${body[0].total_score}\n**SS** ${body[0].count_rank_ss} **SSH** ${body[0].count_rank_ssh} **S** ${body[0].count_rank_s} **SH** ${body[0].count_rank_sh} **A** ${body[0].count_rank_a}\n**300x** ${body[0].count300} **100x** ${body[0].count100} **50x** ${body[0].count50}`
							}],
						}
					});
				}
			})
			break;
		}
		case "urban": {
			if (args == "") {
				msg.channel.send("Usage: `.urban <word>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `http://api.urbandictionary.com/v0/define?term=${args.join("+")}`,
				json: true
			}, function (error, response, body) {
				if (body.list.length < 1) {
					msg.channel.send("Nothing found!");
				}
				else if (body.list[0] == undefined) {
					msg.channel.send("No information about that!");
				}
				else {
					const rnd = Math.floor(Math.random() * body.list.length);
					msg.channel.send({
						embed: {
							color: 16777060,
							author: {
								name: "Urban Dictionary",
								icon_url: "https://i.imgur.com/RZrNvTL.jpg"
							},
							title: body.list[rnd].word,
							url: body.list[rnd].permalink,
							thumbnail: {
								url: `https://a.ppy.sh/5`
							},
							fields: [{
								name: "Definition",
								value: `${body.list[rnd].definition.substring(0, 1020)}...`
							},
							{
								name: "Example",
								value: body.list[rnd].example
							}],
							footer: {
								value: "",
								text: `by ${body.list[rnd].author}`
							},
						}
					});
				}
			})
			break;
		}
		case "steam": {
			if (args == "") {
				msg.channel.send("Usage: `.steam <customurl>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			var steamid;
			request({
				url: `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?vanityurl=${args[0]}`,
				qs: {
					key: api_steam
				},
				json: true
			}, function (error, response, body) {
				if (body.response.success != 1) {
					msg.channel.send("User not found!");
				}
				else {
					request({
						url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?steamids=${body.response.steamid}`,
						qs: {
							key: api_steam
						},
						json: true
					}, function (error, response, body) {
						var date = new Date(body.response.players[0].timecreated * 1000);
						var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						var time = `${date.getDate()}th ${months[date.getMonth()]} ${date.getFullYear()}`;
						var flag = "";
						if (body.response.players[0].loccountrycode != undefined) { flag = `:flag_${body.response.players[0].loccountrycode.toLowerCase()}:` }
						msg.channel.send({
							embed: {
								color: 6579455,
								author: {
									name: "Steam Profile",
									icon_url: `https://i.imgur.com/cNqF7U8.png`
								},
								title: `${body.response.players[0].personaname} ${flag}`,
								url: body.response.players[0].profileurl,
								thumbnail: {
									url: body.response.players[0].avatarfull
								},
								fields: [{
									name: "Statistics",
									value: `**Created on** ${time}\n**URL** ${body.response.players[0].profileurl}`
								}],
							}
						});
					})
				}
			});
			break;
		}
		case "trbmb": {
			if (args == "help") {
				msg.channel.send("Usage: `.trbmb`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `http://api.chew.pro/trbmb`,
				json: true
			}, function (error, response, body) {
				msg.channel.send(body[0]);
			})
			break;
		}
		case "trump": {
			if (args == "help") {
				msg.channel.send("Usage: `.trump (user)`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://api.whatdoestrumpthink.com/api/v1/quotes`,
				json: true
			}, function (error, response, body) {
				if (args == "") {
					msg.channel.send(body.messages.non_personalized[Math.floor(Math.random() * body.messages.non_personalized.length)]);
				}
				else {
					msg.channel.send(`${msg.content.slice(cmd.length + 1)} ${body.messages.personalized[Math.floor(Math.random() * body.messages.personalized.length)]}`);
				}
			})
			break;
		}
		case "rnduser": {
			if (args == "help") {
				msg.channel.send("Usage: `.rnduser`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://api.randomuser.me`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						color: 13158600,
						author: {
							name: "Random User Profile",
							icon_url: "https://i.imgur.com/s4IRi8S.png"
						},
						thumbnail: {
							url: body.results[0].picture.medium
						},
						fields: [{
							name: "Profile",
							value: `**Name** ${body.results[0].name.first} ${body.results[0].name.last}\n**Street** ${body.results[0].location.street}\n**City** ${body.results[0].location.city}\n**State** ${body.results[0].location.state}\n**Phone** ${body.results[0].phone}\n**E-Mail** ${body.results[0].email}`
						},
						{
							name: "Login",
							value: `**Username** ${body.results[0].login.username}\n**Password** ${body.results[0].login.password}`
						}],
					}
				});
			})
			break;
		}
		case "numfact": {
			if (args == "help") {
				msg.channel.send("Usage: `.numfact`").then(m => {
					m.delete(5000);
				});
				return;
			}
			var link;
			var search = "random";
			if (args[1] != undefined) {
				search = args[1];
			}
			switch (args[0]) {
				case "trivia": { link = `http://numbersapi.com/${search}/trivia`; break; }
				case "date": { link = `http://numbersapi.com/${search}/date`; break; }
				case "year": { link = `http://numbersapi.com/${search}/year`; break; }
				case "math": { link = `http://numbersapi.com/${search}/math`; break; }
				case undefined: { link = `http://numbersapi.com/random/`; break; }
				default: { msg.channel.send("Invalid argument!"); return; }
			}
			request({
				url: link,
				json: true
			}, function (error, response, body) {
				if (body.startsWith("Cannot GET") || body.startsWith("Invalid url")) {
					msg.channel.send("Invalid number!");
				}
				else {
					msg.channel.send(body);
				}
			})
			break;
		}
		case "wiki": {
			if (args == "") {
				msg.channel.send("Usage: `.wiki <query>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${args.join("+")}`,
				json: true
			}, function (error, response, body) {
				if (body.query.searchinfo.totalhits < 1) {
					msg.channel.send("Nothing found!");
				}
				else {
					const rnd = Math.floor(Math.random() * body.query.search.length);
					request({
						url: `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info&inprop=url&pageids=${body.query.search[rnd].pageid}`,
						json: true
					}, function (error, response, altbody) {
						msg.channel.send({
							embed: {
								color: 13158600,
								author: {
									name: "Wikipedia Article",
									icon_url: "https://i.imgur.com/WDV9oLh.png"
								},
								title: body.query.search[rnd].title,
								url: altbody.query.pages[body.query.search[rnd].pageid].fullurl,
								fields: [{
									name: "Snippet",
									value: `${body.query.search[rnd].snippet.replace(/<\/?[^>]+(>|$)/g, "")}...`
								}],
							}
						});
					})
				}
			})
			break;
		}
		case "radio": {
			if (args == "help") {
				msg.channel.send("Usage: `.radio`").then(m => {
					m.delete(5000);
				});
				return;
			}
			if (msg.member.voiceChannel) {
				msg.member.voiceChannel.join().then(connection => {
					if (connection.speaking) {
						msg.channel.send(`Stopped streaming.`);
						dispatcher.end();
						msg.member.voiceChannel.leave();
					}
					else {
						msg.channel.send(`Joined ${connection.channel} streaming listen.moe!`);
						dispatcher = connection.playArbitraryInput(`https://listen.moe/stream`);
					}
				})
			}
			else {
				msg.channel.send("You're not in a voice channel!");
			}
			break;
		}
		case "play": {
			if (args == "" || args == "help") {
				msg.channel.send("Usage: `.play <query>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			if (msg.member.voiceChannel) {
				msg.member.voiceChannel.join().then(connection => {
					if(args[0].startsWith("http")) {
						const dispatcher = connection.playArbitraryInput(args[0]);
							dispatcher.on('start', () => {
								msg.channel.send(`Playing: \`${args[0]}\``);
							});
							dispatcher.on('end', () => {
								msg.member.voiceChannel.leave()
							});
							dispatcher.on('error', e => {
								console.log(e);
							});
					}
					else {
					request({
						url: `https://api.github.com/search/code?q=${args.join("+")}+in:path+extension:ogg+path:sound/chatsounds/autoadd+repo:Metastruct/garrysmod-chatsounds`,
						qs: {
							access_token: api_github
						},
						headers: {
							"User-Agent": "Jibril"
						},
						json: true
					}, function (error, response, body) {
						if (body.total_count == 0) {
							msg.channel.send("Nothing found!");
						}
						else {
							const rnd = Math.floor(Math.random() * body.items.length);
							var link = `https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/${encodeURIComponent(body.items[rnd].path.trim())}`;
							const dispatcher = connection.playArbitraryInput(link);
							dispatcher.on('start', () => {
								msg.channel.send(`Playing: \`${body.items[rnd].name}\``);
							});
							dispatcher.on('end', () => {
								msg.member.voiceChannel.leave()
							});
							dispatcher.on('error', e => {
								console.log(e);
							});
						}
					})
					}
				})
			}
			else {
				msg.channel.send("You're not in a voice channel!");
			}
			break;
		}
		case "aki": {
			if (args == "help") {
				msg.channel.send("Usage: `.aki`").then(m => {
					m.delete(5000);
				});
				return;
			}
			aki(msg, args, true);
			break;
		}
	}
});

function img(msg, args, key_num, retried, info) {
	request({
		url: `https://www.googleapis.com/customsearch/v1?searchType=image&fileType=png+jpg+gif&q=${args.join("+")}`,
		qs: {
			key: api_img,
			cx: api_search
		},
		json: true
	}, function (error, response, body) {
		if (api_img == undefined) {
			msg.channel.send(`Command disabled when using heroku!`);
		}
		else if (body.error != undefined) {
			key_num++;
			if (key_num >= cfg.imgkeys.length) {
				if (retried == true) {
					msg.channel.send(`Out of all ${cfg.imgkeys.length} keys!\nPlease wait 24hrs to get all ${cfg.imgkeys.length}00 picture requests back!`);
					return;
				}
				key_num = 0;
				retried = true;
			}
			api_img = cfg.imgkeys[key_num].key;
			img(msg, args, key_num, retried, info);
		}
		else if (body.searchInformation.totalResults < 1) {
			msg.channel.send("Nothing found!");
		}
		else {
			if (info >= 0 && info < body.items.length) {
				msg.channel.send(body.items[info].link);
			}
			else {
				msg.channel.send(body.items[Math.floor(Math.random() * body.items.length)].link);
			}
		}
	})
}

function aki(msg, args, start, session, signature, step, answer, progression, akimsg) {
	if (start === true) {
		request({
			url: `http://api-en1.akinator.com/ws/new_session?partner=1&player=Jibril`,
			json: true
		}, function (error, response, body) {
			var session = body.parameters.identification.session;
			var signature = body.parameters.identification.signature;
			var step = body.parameters.step_information.step;
			var progression = body.parameters.step_information.progression;
			var question = body.parameters.step_information.question;
			msg.channel.send(`${parseInt(step) + 1}. ${question}`).then(async m => {
				await m.react("✅");
				await m.react("✔");
				await m.react("🥖");
				await m.react("✖");
				await m.react("❎");
				const collector = m.createReactionCollector((r, user) =>
					r.emoji.name === "✅" ||
					r.emoji.name === "✔" ||
					r.emoji.name === "🥖" ||
					r.emoji.name === "✖" ||
					r.emoji.name === "❎" && user.id != m.author.id
				);
				collector.once("collect", r => {
					switch (r.emoji.name) {
						case "✅": aki(msg, args, false, session, signature, step, "0", progression, m); break;
						case "✔": aki(msg, args, false, session, signature, step, "3", progression, m); break;
						case "🥖": aki(msg, args, false, session, signature, step, "2", progression, m); break;
						case "✖": aki(msg, args, false, session, signature, step, "4", progression, m); break;
						case "❎": aki(msg, args, false, session, signature, step, "1", progression, m); break;
					}
					r.remove(msg.author);
					collector.stop();
				});
			});
		})
	}
	else {
		request({
			url: `http://api-en1.akinator.com/ws/answer?session=${session}&signature=${signature}&step=${step}&answer=${answer}`,
			json: true
		}, function (error, response, body) {
			var step = body.parameters.step;
			var question = body.parameters.question;
			var progression = body.parameters.progression;
			akimsg.edit(`${parseInt(step) + 1}. ${question}`).then(async m => {
				const collector = m.createReactionCollector((r, user) =>
					r.emoji.name === "✅" ||
					r.emoji.name === "✔" ||
					r.emoji.name === "🥖" ||
					r.emoji.name === "✖" ||
					r.emoji.name === "❎" && user.id != m.author.id
				).once("collect", r => {
					switch (r.emoji.name) {
						case "✅": aki(msg, args, false, session, signature, step, "0", progression, m); break;
						case "✔": aki(msg, args, false, session, signature, step, "3", progression, m); break;
						case "🥖": aki(msg, args, false, session, signature, step, "2", progression, m); break;
						case "✖": aki(msg, args, false, session, signature, step, "4", progression, m); break;
						case "❎": aki(msg, args, false, session, signature, step, "1", progression, m); break;
					}
					r.remove(msg.author);
					collector.stop();
				});
			})
		});
	}
	if (parseInt(progression) == 100) {
		request({
			url: `http://api-en1.akinator.com/ws/list?session=${session}&signature=${signature}&step=${step}&size=2&max_pic_width=246&max_pic_height=294&pref_photos=OK-FR&mode_question=0`,
			json: true
		}, function (error, response, body) {
			akimsg.edit("Found someone!");
			akimsg.clearReactions();
			console.log(body);
			return;
		});
	}
	if (parseInt(step) > 80) {
		akimsg.edit("Out of questions!");
		akimsg.clearReactions();
		return;
	}
}