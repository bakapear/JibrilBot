const request = require("request");

module.exports = {
	name: ["aki", "akinator"],
	desc: "A genie who can guess your character by asking questions.",
	permission: "",
	usage: "",
	args: 0,
	command: function (msg, cmd, args) {
		aki(msg, args, true);
	}
}

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
		});
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
			});
		});
	}
}