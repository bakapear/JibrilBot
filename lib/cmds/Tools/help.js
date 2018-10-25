let fs = require("fs")
let path = require("path")

module.exports = {
    name: ["help", "?", "cmds"],
    desc: "Shows you the usage of a specific command. If no arguments given, it'll show you a list of all available commands to you.",
    permission: "",
    usage: "(command)",
    args: 0,
    command: async function (msg, cmd, args) {
        let files = await getFileInfo(path.join(__dirname + "/../"))
        let cats = {}
        for (let file of files) {
            if (file.data.name.includes(args.join(" "))) {
                msg.channel.send({
                    embed: {
                        color: 1283187,
                        title: `${file.name} [${file.data.name.sort().join(",")}]`,
                        description: `${file.data.desc}\n\nUsage: \`.${args.join(" ")}${file.data.usage}\``
                    }
                })
                return
            }
            if (!cats[file.type]) cats[file.type] = []
            cats[file.type].push(`\`${file.data.name.sort().join(",")}\``)
        }
        if (args.length >= 1) {
            msg.channel.send(`Couldn't find the command \`${args.join(" ")}\`.`)
            return
        }
        let fields = []
        for (let cat in cats) {
            fields.push({
                name: cat + ` (${cats[cat].length})`,
                value: cats[cat].join(" | ")
            })
        }
        msg.channel.send({
            embed: {
                color: 1283187,
                title: `Commands (${files.length})`,
                description: "Usage: `.help <cmd>`",
                fields: fields
            }
        })
    }
}

async function getFileInfo(dir) {
    let files = getAllFiles(dir)
    let data = []
    for (let i = 0; i < files.length; i++) {
        let arr = files[i].split("\\")
        data.push({ name: arr.pop().slice(0, -3), type: arr.pop(), data: require(`${files[i]}`) })
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