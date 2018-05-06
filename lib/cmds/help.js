let fs = require("fs");

module.exports = {
    name: ["help"],
    desc: "Shows you the usage of a specific command. If no arguments given, it'll show you a list of all available commands to you.",
    permission: "",
    usage: "(command)",
    args: 0,
    command: async function (msg, cmd, args) {
        let files = await getFileData("cmds");
        let filenames = [];
        let subcount = 0;
        for (let i = 0; i < files.length; i++) {
            if (args[0] && files[i].name.includes(args[0])) {
                msg.channel.send({
                    embed: {
                        color: 11321432,
                        author: {
                            name: `.${args[0]} [${files[i].name}]`,
                            icon_url: "https://i.imgur.com/4AEPwtC.png"
                        },
                        description: `${files[i].desc}\nUsage: \`.${args[0]} ${files[i].usage}\``
                    }
                });
                return;
            }
            filenames.push(files[i].name);
            subcount += files[i].name.length;
        }
        msg.channel.send({
            embed: {
                color: 11321432,
                author: {
                    name: `Commands (${subcount} in ${filenames.length})`,
                    icon_url: "https://i.imgur.com/4AEPwtC.png"
                },
                description: `\`${filenames.join("|")}\`\n\nUsage: \`.help <cmd>\``
            }
        });
    }
}

async function getFileData(dir) {
    let files = await fs.readdirSync("./lib/" + dir);
    let data = [];
    for (let i = 0; i < files.length; i++) {
        data.push(require(`./${files[i]}`));
    }
    return data;
}