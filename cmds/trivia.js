const request = require("request");

module.exports = {
    name: ["trivia"],
    desc: "Asks questions, you should prolly answer.",
    permission: "",
	usage: "(question)",
	args: 0,
    command: function (boot, msg, cmd, args) {
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
            });
        });
    }
}