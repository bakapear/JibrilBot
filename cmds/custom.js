const got = require("got");
const fs = require("fs");
const config = "./data/";

module.exports = {
    name: ["c", "custom"],
    desc: "Add your own images to storage and display 'em randomly.",
    permission: "",
    usage: "add <imageurl> | remove <index/clear> | list | <index>",
    args: 0,
    command: async function (msg, cmd, args) {
        if (!fs.existsSync(config)) fs.mkdirSync(config);
        const userpath = config + msg.author.id + ".cfg";
        if (!fs.existsSync(userpath)) fs.closeSync(fs.openSync(userpath, 'w'));
        const data = fs.readFileSync(userpath, { encoding: "utf8" });
        const content = data.split("\n");
        if (args[0] == "add") {
            if (!args[1]) { msg.channel.send("Please give a valid image URL to add!"); return; }
            let newline = "\n";
            if (data == "") { newline = "" }
            fs.writeFileSync(userpath, data + newline + args[1]);
            msg.channel.send(`Added to your storage.`);
            return;
        }
        if (data == "") { msg.channel.send("Your storage is empty!"); return; }
        if (args[0] == "remove") {
            if (args[1] == "clear") {
                fs.writeFileSync(userpath, "");
                msg.channel.send("Cleared your storage!");
                return;
            }
            if (!args[1] || isNaN(args[1])) { msg.channel.send("Please enter a valid index to remove!"); return; }
            if (parseInt(args[1]) - 1 < 0 || parseInt(args[1]) - 1 >= content.length) { msg.channel.send("Invalid index!"); return; }
            let newdata = "";
            let newline = "\n";
            for (i = 0; i < content.length; i++) {
                if (i == parseInt(args[1]) - 1) continue;
                if (i == content.length - 1) newline = "";
                newdata += content[i] + newline;
            }
            newdata = newdata.trim();
            if (newdata.endsWith("/n")) newdata = newdata.substring(0, newdata.length - 2);
            fs.writeFileSync(userpath, newdata);
            msg.channel.send(`Removed \`@${parseInt(args[1])}\` from your storage.`);
            return;
        }
        if (args[0] == "list") {
            let items = [];
            for (i = 0; i < content.length; i++) {
                items.push(`${i + 1}. \`[${content[i]}](${content[i]})\`\n`);
            }
            msg.channel.send({
                embed: {
                    color: 1313320,
                    title: `Storage [${msg.author.username}]`,
                    description: items.join("").substring(0, 2045)
                },
            });
            return;
        }
        let mod = Math.floor(Math.random() * content.length);
        if (!isNaN(args[0])) mod = parseInt(args[0] - 1);
        if (mod < 0 || mod >= content.length) { msg.channel.send("Invalid index!"); return; }
        msg.channel.send({
            embed: {
                color: 1313320,
                image: {
                    url: content[mod]
                },
                footer: {
                    text: `by ${msg.author.username} @${mod + 1}`
                }
            },
        }).catch(err => {
            console.log("WHAT: " + err);
        });
    }
}