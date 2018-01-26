const Discord = require("discord.js");
const bot = new Discord.Client();
const request = require("request");
const yt = require('ytdl-core');
const google = require('google');

bot.login(process.env.BOT_TOKEN);
const api_google = process.env.API_GOOGLE;
const api_giphy = process.env.API_GIPHY;
const api_search = process.env.API_SEARCH;
const api_osu = process.env.API_OSU;
const api_steam = process.env.API_STEAM;
const api_github = process.env.API_GITHUB;
const api_musix = process.env.API_MUSIX;

const date_boot = new Date();

bot.on("ready", () => {
	console.log(`Your personal servant ${bot.user.tag} is waiting for orders!`);
	bot.user.setPresence({ game: { name: "with master", type: 0 } });
});

bot.on("message", msg => {
	if (msg.author.bot || !(msg.content.startsWith(".") || msg.content.startsWith(","))) return;
	if (msg.content.startsWith(",")) {
		msg.delete();
	}
	const args = msg.content.slice(1).split(" ");
	const cmd = args.shift().toLowerCase();
	switch (cmd) {
		case "ping": {
			if (args == "help") {
				msg.channel.send("Usage: `.ping`").then(m => {
					m.delete(5000);
				});
				return;
			}
			const date = Date.now();
			msg.channel.send("Pinging...").then(m => {
				m.edit(`Pong! It took me **${Date.now() - date}ms**!`);
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
				msg.channel.send("Usage: `.roll (min) (max)`").then(m => {
					m.delete(5000);
				});
				return;
			}
			let max = 6, min = 1;
			if (args.length == 1) {
				max = parseInt(args[0]);
			}
			else if (args.length > 1) {
				min = parseInt(args[1]);
				max = parseInt(args[0]);
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
			msg.channel.send(msg.content.slice(cmd.length + 1));
			break;
		}
		case "8ball": {
			const answers = [
				":8ball: It is certain",
				":8ball: It is decidedly so",
				":8ball: Without a doubt",
				":8ball: Yes definitely",
				":8ball: You may rely on it",
				":8ball: As I see it, yes",
				":8ball: Most likely",
				":8ball: Outlook good",
				":8ball: Yes",
				":8ball: Signs point to yes",
				":8ball: Reply hazy try again",
				":8ball: Ask again later",
				":8ball: Better not tell you now",
				":8ball: Cannot predict now",
				":8ball: Concentrate and ask again",
				":8ball: Don't count on it",
				":8ball: My reply is no",
				":8ball: Outlook not so good",
				":8ball: Very doubtful"
			];
			msg.channel.send(answers[Math.floor(Math.random() * answers.length)]);
			break;
		}
		case "pick": {
			if (args == "" || args == "help") {
				msg.channel.send("Usage: `.pick <choice1,choice2,choice3...>`\nseperator: \`;\`").then(m => {
					m.delete(5000);
				});
				return;
			}
			const parts = msg.content.slice(cmd.length + 1).split(";");
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
				msg.channel.send({
					embed: {
						image: {
							url: body.file
						}
					},
				});
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
				msg.channel.send({
					embed: {
						image: {
							url: body.message
						}
					},
				});
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
			if (args == "") {
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
				url: `http://api.giphy.com/v1/gifs/random?tag=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
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
					msg.channel.send({
						embed: {
							image: {
								url: body.data.image_url
							}
						},
					});
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
				url: `https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
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
			if (args == "") {
				msg.channel.send("Usage: `.img <query>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://api.qwant.com/api/search/images?count=10&safesearch=1&locale=en_US&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
				headers: {
					"User-Agent": "Jibril"
				},
				json: true
			}, function (error, response, body) {
				if (body.data.result.items.length < 1) {
					msg.channel.send("Nothing found!");
					return;
				}
				const rnd = Math.floor(Math.random() * body.data.result.items.length);
				msg.channel.send({
					embed: {
						image: {
							url: body.data.result.items[rnd].media
						}
					},
				});
			})
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
				url: `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
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
			let steamid;
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
						let date = new Date(body.response.players[0].timecreated * 1000);
						let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
						let time = `${date.getDate()}th ${months[date.getMonth()]} ${date.getFullYear()}`;
						let flag = "";
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
			let link;
			let search = "random";
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
		case "play": {
			if (args == "") {
				msg.channel.send("Usage: `.q <query>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			if (!msg.member.voiceChannel) {
				msg.channel.send("You're not in a voice channel!");
				return
			}
			if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
				request({
					url: `https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
					qs: {
						key: api_google
					},
					json: true
				}, function (error, response, body) {
					if (body.items.length < 1) {
						msg.channel.send("Nothing found!");
					}
					else {
						let videoid = body.items[0].id.videoId;
						request({
							url: `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoid}`,
							qs: {
								key: api_google
							},
							json: true
						}, function (error, response, body) {
							let player;
							msg.member.voiceChannel.join().then(connection => {
								msg.channel.send({
									embed: {
										color: 14506163,
										title: "Now Playing",
										description: `\`${body.items[0].snippet.title}\``,
										image: {
											url: body.items[0].snippet.thumbnails.medium.url
										}
									}
								}).then(m => {
									player = connection.playStream(yt(videoid, { audioonly: true }));
									player.setBitrate(96000);
									player.on('end', () => {
										msg.member.voiceChannel.leave();
									});
								})
							})
						})

					}
				})
			}
			else {
				msg.channel.send(`Something is already playing!`);
			}
			break;
		}
		case "radio": {
			if (args == "help") {
				msg.channel.send("Usage: `.radio`").then(m => {
					m.delete(5000);
				});
				return;
			}
			if (!msg.member.voiceChannel) {
				msg.channel.send("You're not in a voice channel!");
				return
			}
			let radio;
			if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
				msg.member.voiceChannel.join().then(connection => {
					msg.channel.send({
						embed: {
							color: 14506163,
							title: "Radio",
							description: `Joined ${connection.channel} streaming *listen.moe*!`
						}
					})
					radio = connection.playArbitraryInput(`https://listen.moe/opus`);
					radio.setBitrate(96000);
				})
			}
			else {
				msg.channel.send({
					embed: {
						color: 14506163,
						title: "Radio",
						description: `Stopped streaming radio.`
					}
				})
				msg.member.voiceChannel.leave();
			}
			break;
		}
		case "snd": {
			if (args == "") {
				msg.channel.send("Usage: `.snd <query>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			if (!msg.member.voiceChannel) {
				msg.channel.send("You're not in a voice channel!");
				return
			}
			let player;
			if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
				msg.member.voiceChannel.join().then(connection => {
					if (args[0].startsWith("http") && (args[0].endsWith(".ogg") || args[0].endsWith(".mp3") || args[0].endsWith(".wav"))) {
						player = connection.playArbitraryInput(args[0]);
						player.setBitrate(96000);
						msg.channel.send({
							embed: {
								color: 14506163,
								title: "Playing Soundfile",
								description: `\`${args[0]}\``
							}
						}).then(m => {
							player.on('end', () => {
								msg.member.voiceChannel.leave()
							});
						});
						player.on('error', e => {
							console.log(e);
						});
					}
					else {
						msg.channel.send({
							embed: {
								color: 14506163,
								title: "Searching Sound..."
							}
						}).then(m => {
							request({
								url: `https://api.github.com/search/code?q=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}+in:path+extension:ogg+path:sound/chatsounds/autoadd+repo:Metastruct/garrysmod-chatsounds`,
								qs: {
									access_token: api_github
								},
								headers: {
									"User-Agent": "Jibril"
								},
								json: true
							}, function (error, response, body) {
								if (body.total_count < 1) {
									m.edit({
										embed: {
											color: 14506163,
											title: "Nothing found!"
										}
									});
									msg.member.voiceChannel.leave();
								}
								else {
									const rnd = Math.floor(Math.random() * body.items.length);
									let link = `https://raw.githubusercontent.com/Metastruct/garrysmod-chatsounds/master/${encodeURIComponent(body.items[rnd].path.trim())}`;
									player = connection.playArbitraryInput(link);
									player.setBitrate(96000);
									m.edit({
										embed: {
											color: 14506163,
											title: "Playing Sound",
											description: `\`${body.items[rnd].name}\``
										}
									});
									player.on('end', () => {
										msg.member.voiceChannel.leave();
									});
									player.on('error', e => {
										console.log(e);
									});
								}
							})
						})
					}
				})
			}
			else {
				msg.channel.send(`Something is already playing!`);
			}
			break;
		}
		case "stop": {
			if (!msg.member.voiceChannel) {
				msg.channel.send("You're not in a voice channel!");
				return
			}
			if (bot.voiceConnections.get(msg.channel.guild.id) == undefined) {
				msg.channel.send("I'm not in a voice channel!");
				return
			}
			msg.member.voiceChannel.leave();
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
		case "yes": {
			if (args == "help") {
				msg.channel.send("Usage: `.yes`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://yesno.wtf/api?force=yes`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: body.image
						}
					},
				});
			})
			break;
		}
		case "no": {
			if (args == "help") {
				msg.channel.send("Usage: `.no`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://yesno.wtf/api?force=no`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: body.image
						}
					},
				});
			})
			break;
		}
		case "maybe": {
			if (args == "help") {
				msg.channel.send("Usage: `.maybe`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://yesno.wtf/api?force=maybe`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: body.image
						}
					},
				});
			})
			break;
		}
		case "math": {
			if (args == "" || args == "help") {
				msg.channel.send("Usage: `.math <expression>`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `http://api.mathjs.org/v1/?expr=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`,
				json: true
			}, function (error, response, body) {
				msg.channel.send(body);
			})
			break;
		}
		case "color": {
			let link = `http://www.colourlovers.com/api/colors?format=json&keywords=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}`;
			if (args == "") {
				link = `http://www.colourlovers.com/api/colors/random?format=json`
			}
			request({
				url: link,
				json: true
			}, function (error, response, body) {
				if (body.length < 1) {
					msg.channel.send("Nothing found!");
					return;
				}
				const rnd = Math.floor(Math.random() * body.length);
				let colorint = (body[rnd].rgb.red << 16) + (body[rnd].rgb.green << 8) + (body[rnd].rgb.blue);
				msg.channel.send({
					embed: {
						color: colorint,
						title: body[rnd].title,
						description: `**Hex** #${body[rnd].hex}\n**R** ${body[rnd].rgb.red} **G** ${body[rnd].rgb.green} **B** ${body[rnd].rgb.blue}\n**H** ${body[rnd].hsv.hue} **S** ${body[rnd].hsv.saturation} **V** ${body[rnd].hsv.value}`,
						image: {
							url: body[rnd].imageUrl
						}
					}
				});
			})
			break;
		}
		case "lyrics": {
			if (args == "" || args == "help") {
				msg.channel.send("Usage: `.lyrics <song>`").then(m => {
					m.delete(5000);
				});
			}
			request({
				url: `http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(msg.content.slice(cmd.length + 1).trim())}&page_size=3&page=1&s_track_rating=desc`,
				qs: {
					apikey: api_musix
				},
				json: true
			}, function (error, response, body) {
				if (body.message.header.available < 1) {
					msg.channel.send("Nothing found!");
					return;
				}
				let tracktitle = `${body.message.body.track_list[0].track.artist_name} - ${body.message.body.track_list[0].track.track_name}`;
				request({
					url: `http://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${body.message.body.track_list[0].track.track_id}`,
					qs: {
						apikey: api_musix
					},
					json: true
				}, function (error, response, body) {
					if (body.message.header.status_code == 404) {
						msg.channel.send("Nothing found!");
						return;
					}
					msg.channel.send({
						embed: {
							color: 14024703,
							title: tracktitle,
							description: body.message.body.lyrics.lyrics_body.slice(0, -70)
						},
					});
				})
			})
			break;

		}
		case "osumap": {
			if (args == "help") {
				msg.channel.send("Usage: `.osumap (s:stars) (t:length)`").then(m => {
					m.delete(5000);
				});
				return;
			}
			let date = new Date();
			date.setDate(1);
			date.setMonth(date.getMonth() - 2);
			date = date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' + ('00' + date.getUTCDate()).slice(-2) + ' ' + '00:00:00';
			request({
				url: `https://osu.ppy.sh/api/get_beatmaps?m=0&since=${date}`,
				qs: {
					k: api_osu
				},
				json: true
			}, function (error, response, body) {
				let mapindex = [];
				let stars;
				let length;
				for (a = 0; a < args.length; a++) {
					if (args[a].startsWith("s:")) {
						stars = parseFloat(args[a].slice(2));
					}
					if (args[a].startsWith("l:")) {
						length = parseInt(args[a].slice(2));
					}
				}
				for (i = 0; i < body.length; i++) {
					if (body[i].approved == 1) {
						if (args == "" || (stars == undefined && length == undefined)) {
							mapindex.push(i);
						}
						else {
							if (stars != undefined) {
								if (!(body[i].difficultyrating >= stars - 0.3 && body[i].difficultyrating <= stars + 0.3)) {
									continue;
								}
							}
							if (length != undefined) {
								if (!(body[i].hit_length <= length)) {
									continue;
								}
							}
							mapindex.push(i);
						}
					}
				}
				if (mapindex.length < 1) {
					msg.channel.send("Nothing found!");
					return;
				}
				const rnd = Math.floor(Math.random() * mapindex.length)
				let mins = Math.floor(body[mapindex[rnd]].hit_length % 3600 / 60);
				let secs = Math.floor(body[mapindex[rnd]].hit_length % 3600 % 60);
				if (secs.toString().length < 2) {
					secs = "0" + secs;
				}
				let duration = `${mins}:${secs}`;
				msg.channel.send({
					embed: {
						color: 15033501,
						author: {
							name: `osu! Beatmap`,
							icon_url: `https://i.imgur.com/oEbzSZU.png`
						},
						title: `${body[mapindex[rnd]].artist} - ${body[mapindex[rnd]].title}`,
						description: `**Stars** ${parseFloat(body[mapindex[rnd]].difficultyrating).toFixed(2)} **Length** ${duration} **BPM** ${parseInt(body[mapindex[rnd]].bpm)}`,
						url: `https://osu.ppy.sh/b/${body[mapindex[rnd]].beatmap_id}`,
					}
				});
			})
			break;
		}
		case "invite": {
			let invitelink = `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=8`;
			const uptime = new Date(Date.now() - date_boot);
			msg.channel.send({
				embed: {
					color: 14506163,
					title: `Invite ${bot.user.username} to your server!`,
					description: `The youngest and strongest discord bot of the Flügel race.\n\n**Guilds** ${bot.guilds.size} **Users** ${bot.users.size} **Channels** ${bot.channels.size}\n**Uptime** ${uptime.getMonth()} Months ${uptime.getDate() - 1} Days ${uptime.getHours()} Hours ${uptime.getMinutes()} Minutes ${uptime.getSeconds()} Seconds`,
					url: invitelink,
					thumbnail: {
						url: bot.user.avatarURL
					},
					footer: {
						text: "created and managed by bakapear"
					}
				}
			});
			break;
		}
		case "lick": {
			if (args == "help") {
				msg.channel.send("Usage: `.lick`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=lick`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "cuddle": {
			if (args == "help") {
				msg.channel.send("Usage: `.cuddle`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=cuddle`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "smug": {
			if (args == "help") {
				msg.channel.send("Usage: `.smug`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=smug`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "hug": {
			if (args == "help") {
				msg.channel.send("Usage: `.hug`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=hug`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "cute": {
			if (args == "help") {
				msg.channel.send("Usage: `.cute`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=cute`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "kiss": {
			if (args == "help") {
				msg.channel.send("Usage: `.kiss`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=kiss`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "chu": {
			if (args == "help") {
				msg.channel.send("Usage: `.chu`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=chu`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "pat": {
			if (args == "help") {
				msg.channel.send("Usage: `.pat`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=pat`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "pout": {
			if (args == "help") {
				msg.channel.send("Usage: `.pout`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=pout`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "cry": {
			if (args == "help") {
				msg.channel.send("Usage: `.cry`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=cry`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "stare": {
			if (args == "help") {
				msg.channel.send("Usage: `.stare`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=stare`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "triggered": {
			if (args == "help") {
				msg.channel.send("Usage: `.triggered`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=triggered`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "slap": {
			if (args == "help") {
				msg.channel.send("Usage: `.slap`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=slap`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "tickle": {
			if (args == "help") {
				msg.channel.send("Usage: `.tickle`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=tickle`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "lewd": {
			if (args == "help") {
				msg.channel.send("Usage: `.lewd`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=lewd`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "owo": {
			if (args == "help") {
				msg.channel.send("Usage: `.owo`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=owo`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "nom": {
			if (args == "help") {
				msg.channel.send("Usage: `.nom`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=nom`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "weird": {
			if (args == "help") {
				msg.channel.send("Usage: `.weird`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=weird`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "clap": {
			if (args == "help") {
				msg.channel.send("Usage: `.clap`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=clap`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "potato": {
			if (args == "help") {
				msg.channel.send("Usage: `.potato`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://rra.ram.moe/i/r?type=potato`,
				json: true
			}, function (error, response, body) {
				msg.channel.send({
					embed: {
						image: {
							url: `https://rra.ram.moe${body.path}`
						}
					},
				});
			})
			break;
		}
		case "flip": {
			const rnd = Math.random();
			if (rnd > 0.5) {
				msg.channel.send("It's **Tails!**");
			}
			else {
				msg.channel.send("It's **Heads!**");
			}
			break;
		}
		case "trivia": {
			if (args == "help") {
				msg.channel.send("Usage: `.trivia`").then(m => {
					m.delete(5000);
				});
				return;
			}
			request({
				url: `https://opentdb.com/api.php?amount=1&category=9&encode=url3986`,
				json: true
			}, function (error, response, body) {
				let desc = "";
				let questions = [body.results[0].correct_answer];
				for (i = 0; i < body.results[0].incorrect_answers.length; i++) {
					questions.push(body.results[0].incorrect_answers[i]);
				}
				questions.sort();
				for (i = 0; i < questions.length; i++) {
					desc += `**${i + 1}.** ${questions[i]}\n`;
				}
				msg.channel.send({
					embed: {
						title: decodeURIComponent(body.results[0].question),
						description: decodeURIComponent(desc)
					},
				}).then(async m => {
					let answer;
					if (body.results[0].type == "boolean") {
						let reactions = ["1⃣", "2⃣"];
						for (i = 0; i < questions.length; i++) {
							await m.react(reactions[i]);
						}
						const collector = m.createReactionCollector((r, user) =>
							(r.emoji.name === "1⃣" ||
								r.emoji.name === "2⃣") && user.id != m.author.id
						);
						collector.once("collect", r => {
							switch (r.emoji.name) {
								case "1⃣": { answer = questions[0]; break; }
								case "2⃣": { answer = questions[1]; break; }
							}
							collector.stop();
						})
					}
					else {
						let reactions = ["1⃣", "2⃣", "3⃣", "4⃣"];
						for (i = 0; i < questions.length; i++) {
							await m.react(reactions[i]);
						}
						const collector = m.createReactionCollector((r, user) =>
							user.id != m.author.id
						);
						collector.once("collect", r => {
							switch (r.emoji.name) {
								case "1⃣": { answer = questions[0]; break; }
								case "2⃣": { answer = questions[1]; break; }
								case "3⃣": { answer = questions[2]; break; }
								case "4⃣": { answer = questions[3]; break; }
							}
							collector.stop();
						})
					}
					if (answer == body.results[0].correct_answer) {
						m.edit({
							embed: {
								title: decodeURIComponent(body.results[0].question),
								description: `You're Right!\n\`${decodeURIComponent(body.results[0].correct_answer)}\` is indeed the correct answer.`
							}
						});
					}
					else {
						m.edit({
							embed: {
								title: decodeURIComponent(body.results[0].question),
								description: `You're Wrong!\n\`${decodeURIComponent(body.results[0].correct_answer)}\` is the correct answer.`
							}
						});
					}
				})
			})
			break;
		}
		case "np": {
			request({
				url: `https://listen.moe/api/songs`,
				headers: {
					"User-Agent": "Jibril",
					"Content-Type": "application/json",
					"Accept": "application/vnd.listen.v4+json"
				},
				json: true
			}, function (error, response, body) {
				console.log(body);
			})
			break;
		}
		case "google": {
			google(args.join(" "), function (error, res) {
				if (error) console.error(error);
				let boi;
				for (i = 0; i < res.links.length; i++) {
					if (res.links[i].title != null && res.links[i].description != null && res.links[i].href != null) {
						boi = i;
						break;
					}
				}
				if (boi == undefined) {
					msg.channel.send("Nothing found!");
					return;
				}
				msg.channel.send({
					embed: {
						color: 1231312,
						title: res.links[boi].title,
						url: res.links[boi].href,
						description: res.links[boi].description,
					},
				});
			})
			break;
		}
	}
});


function aki(msg, args, start, session, signature, step, answer, progression, akimsg) {
	if (progression >= 92 || parseInt(step) >= 80) {
		request({
			url: `http://api-en1.akinator.com/ws/list?session=${session}&signature=${signature}&step=${step}&size=2&max_pic_width=360&max_pic_height=640&mode_question=1`,
			json: true
		}, function (error, response, body) {
			akimsg.clearReactions();
			akimsg.edit({
				embed: {
					color: 10008404,
					author: {
						name: `Result`,
						icon_url: `https://i.imgur.com/PvoQdrt.png`
					},
					image: {
						url: body.parameters.elements[0].element.absolute_picture_path
					},
					fields: [{
						name: body.parameters.elements[0].element.name,
						value: `${body.parameters.elements[0].element.description}\n\n**Rank** #${body.parameters.elements[0].element.ranking}\n**Probability** ${parseInt(body.parameters.elements[0].element.proba * 100)}%`,
					}],
				}
			});
		});
		return;
	}
	if (start === true) {
		request({
			url: `http://api-en1.akinator.com/ws/new_session?partner=1&player=Jibril`,
			json: true
		}, function (error, response, body) {
			let session = body.parameters.identification.session;
			let signature = body.parameters.identification.signature;
			let step = body.parameters.step_information.step;
			let progression = body.parameters.step_information.progression;
			let question = body.parameters.step_information.question;
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
			let step = body.parameters.step;
			let question = body.parameters.question;
			let progression = body.parameters.progression;
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
}