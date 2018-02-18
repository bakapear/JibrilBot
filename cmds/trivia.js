const got = require("got");

module.exports = {
    name: ["trivia"],
    desc: "Asks questions, you should prolly answer.",
    permission: "",
    usage: "(question)",
    args: 0,
    command: async function (msg, cmd, args) {
        let res = await got(`https://opentdb.com/api.php?amount=1&encode=url3986&token=${token_trivia[msg.guild.id]}`, { json: true });
        if (res.body.response_code == 3) {
            const res2 = await got("https://opentdb.com/api_token.php?command=request", { json: true });
            if (!token_trivia.hasOwnProperty(msg.guild.id)) token_trivia[msg.guild.id] = "";
            token_trivia[msg.guild.id] = res2.body.token;
            res = await got(`https://opentdb.com/api.php?amount=1&encode=url3986&token=${token_trivia[msg.guild.id]}`, { json: true });
        }
        if (res.body.response_code != 0) { msg.channel.send("Something went wrong!"); return; }
        if (res.body.results.length < 1) { msg.channel.send("No questions found?!"); return; }
        let answers = decodeURIComponent(res.body.results[0].incorrect_answers.concat(res.body.results[0].correct_answer)).split(",").sort();
        let filter = (r, u) => true
        if (res.body.results[0].type == "boolean") answers = answers.reverse();
        switch (answers.length) {
            case 2: {
                filter = (r, u) =>
                    r.emoji.name === "1⃣" ||
                    r.emoji.name === "2⃣" && u.id === msg.author.id
                break;
            }
            case 3: {
                filter = (r, u) =>
                    r.emoji.name === "1⃣" ||
                    r.emoji.name === "2⃣" ||
                    r.emoji.name === "3⃣" && u.id === msg.author.id
                break;
            }
            case 4: {
                filter = (r, u) =>
                    r.emoji.name === "1⃣" ||
                    r.emoji.name === "2⃣" ||
                    r.emoji.name === "3⃣" ||
                    r.emoji.name === "4⃣" && u.id === msg.author.id
                break;
            }
            case 5: {
                filter = (r, u) =>
                    r.emoji.name === "1⃣" ||
                    r.emoji.name === "2⃣" ||
                    r.emoji.name === "3⃣" ||
                    r.emoji.name === "4⃣" ||
                    r.emoji.name === "5⃣" && u.id === msg.author.id
                break;
            }
            case 6: {
                filter = (r, u) =>
                    r.emoji.name === "1⃣" ||
                    r.emoji.name === "2⃣" ||
                    r.emoji.name === "3⃣" ||
                    r.emoji.name === "4⃣" ||
                    r.emoji.name === "5⃣" ||
                    r.emoji.name === "6⃣" && u.id === msg.author.id
                break;
            }
            case 7: {
                filter = (r, u) =>
                    r.emoji.name === "1⃣" ||
                    r.emoji.name === "2⃣" ||
                    r.emoji.name === "3⃣" ||
                    r.emoji.name === "4⃣" ||
                    r.emoji.name === "5⃣" ||
                    r.emoji.name === "6⃣" ||
                    r.emoji.name === "7⃣" && u.id === msg.author.id
                break;
            }
            case 8: {
                filter = (r, u) =>
                    r.emoji.name === "1⃣" ||
                    r.emoji.name === "2⃣" ||
                    r.emoji.name === "3⃣" ||
                    r.emoji.name === "4⃣" ||
                    r.emoji.name === "5⃣" ||
                    r.emoji.name === "6⃣" ||
                    r.emoji.name === "7⃣" ||
                    r.emoji.name === "8⃣" && u.id === msg.author.id
                break;
            }
        }
        let options = "";
        for (i = 0; i < answers.length; i++) {
            options += `**${i + 1}.** ${answers[i]}\n`;
        }
        let colorint = 0;
        switch (res.body.results[0].difficulty) {
            case "easy": { colorint = 4980605; break; }
            case "medium": { colorint = 16742455; break; }
            case "hard": { colorint = 16727100; break; }
        }
        let reactions = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣"];
        msg.channel.send({
            embed: {
                color: colorint,
                title: decodeURIComponent(res.body.results[0].question),
                description: options
            },
        }).then(async m => {
            for (i = 0; i < answers.length; i++) {
                await m.react(reactions[i]);
            }
            const collector = m.createReactionCollector(filter, { time: 300000 }).on("collect", r => {
                collector.stop();
                m.clearReactions();
            });
            collector.on("end", (collected) => {
                let pick;
                switch (collected.lastKey()) {
                    case "1⃣": { pick = answers[0]; break; }
                    case "2⃣": { pick = answers[1]; break; }
                    case "3⃣": { pick = answers[2]; break; }
                    case "4⃣": { pick = answers[3]; break; }
                    case "5⃣": { pick = answers[4]; break; }
                    case "6⃣": { pick = answers[5]; break; }
                    case "7⃣": { pick = answers[6]; break; }
                    case "8⃣": { pick = answers[7]; break; }
                }
                let title, desc;
                if (pick == decodeURIComponent(res.body.results[0].correct_answer)) {
                    title = `✅ Right Answer!`;
                    desc = `<@${msg.author.id}> got the right answer!`
                }
                else {
                    title = `❎ Wrong Answer!`;
                    desc = `<@${msg.author.id}> got the wrong answer!`
                }
                options = "";
                for (i = 0; i < answers.length; i++) {
                    if (answers[i] == decodeURIComponent(res.body.results[0].correct_answer)) options += `**${i + 1}.** \`${answers[i]}\`\n`;
                    else options += `**${i + 1}.** ${answers[i]}\n`;
                }
                m.edit({
                    embed: {
                        color: colorint,
                        title: decodeURIComponent(res.body.results[0].question),
                        description: options,
                        fields: [
                            {
                                name: title,
                                value: desc
                            }
                        ]
                    },
                });
            });
        });
    }
}