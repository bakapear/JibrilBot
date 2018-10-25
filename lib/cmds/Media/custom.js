let bin_key = process.env.BIN_KEY
let bin = require("jsonbin.org")("token " + bin_key)

module.exports = {
    name: ["c", "custom"],
    desc: "Store random shit in a database so you can show it to your... friends. For embed displays put your stuff in brackets like [this].",
    permission: "",
    usage: "(folder/list) <create/delete/list/add/remove/id> (stuff/name/id)",
    args: 0,
    command: async function (msg, cmd, args) {
        let path = "jibril/" + msg.guild.id + "/cmds/custom/" + msg.author.id + "/"
        if (args.length < 1) {
            let store = await bin.get(path)
            let items = []
            for (let i = 0; i < Object.keys(store).length; i++) {
                for (let j = 0; j < store[Object.keys(store)[i]].length; j++) {
                    items.push(store[Object.keys(store)[i]][j])
                }
            }
            showItem(msg, items[Math.floor(Math.random() * items.length)])
        }
        else if (args[0] === "list") {
            let store = await bin.get(path)
            if (Object.keys(store).length < 1) {
                msg.channel.send("You currently have no folders!")
            }
            else {
                let folders = []
                for (let i = 0; i < Object.keys(store).length; i++) {
                    folders.push(`${i + 1}. \`${Object.keys(store)[i]}: ${store[Object.keys(store)[i]].length} Items\``)
                }
                msg.channel.send({
                    embed: {
                        color: 4212432,
                        title: `${msg.author.username}'s items in '${args[0]}'`,
                        description: folders.join("\n").substring(0, 2045)
                    }
                })
            }
        }
        else if (!isNaN(args[1])) {
            let arr = await bin.get(path + args[0])
            if (inRange(args[1], arr)) {
                let item = arr[args[1] - 1]
                showItem(msg, item)
            }
            else {
                msg.channel.send(`Invalid index! Number must be between 1-${arr.length}`)
            }
        }
        else {
            switch (args[1]) {
                case "create": {
                    if ((await bin.get(path + args[0])) !== null) {
                        msg.channel.send(`The folder \`${args[0]}\` already exists!`)
                    }
                    else {
                        await bin.post(path + args[0], [])
                        msg.channel.send(`Created folder \`${args[0]}\``)
                    }
                    break
                }
                case "delete": {
                    if ((await bin.get(path + args[0])) === null) {
                        msg.channel.send(`The folder \`${args[0]}\` doesn't exist!`)
                    }
                    else {
                        await bin.delete(path + args[0])
                        msg.channel.send(`Deleted folder \`${args[0]}\``)
                    }
                    break
                }
                case "add": {
                    let store = await bin.get(path + args[0])
                    if (store === null) {
                        msg.channel.send(`The folder \`${args[0]}\` doesn't exist!`)
                    }
                    else {
                        let arr = store
                        arr.push(args.slice(2).join(" "))
                        await bin.post(path + args[0], arr)
                        msg.channel.send(`Added \`${args.slice(2).join(" ")}\` [${arr.length}] to \`${args[0]}\``)
                    }
                    break
                }
                case "remove": case "rem": {
                    let store = await bin.get(path + args[0])
                    if (store === null) {
                        msg.channel.send(`The folder \`${args[0]}\` doesn't exist!`)
                    }
                    else if (store.length < 1) {
                        msg.channel.send(`The folder \`${args[0]}\` contains no items!`)
                    }
                    else {
                        let arr = await bin.get(path + args[0])
                        if (inRange(args[2], arr)) {
                            let item = arr.splice(args[2] - 1, 1)
                            await bin.post(path + args[0], arr)
                            msg.channel.send(`Deleted \`${item}\` [${args[2]}] from \`${args[0]}\``)
                        }
                        else {
                            msg.channel.send(`Invalid index! Number must be between 1-${arr.length}`)
                        }
                    }
                    break
                }
                case "list": {
                    let store = await bin.get(path + args[0])
                    if (store === null) {
                        msg.channel.send(`The folder \`${args[0]}\` doesn't exist!`)
                    }
                    else if (store.length < 1) {
                        msg.channel.send(`The folder \`${args[0]}\` contains no items!`)
                    }
                    else {
                        let files = []
                        for (let i = 0; i < store.length; i++) {
                            files.push(`${i + 1}. \`${store[i]}\``)
                        }
                        msg.channel.send({
                            embed: {
                                color: 4212432,
                                title: `${msg.author.username}'s items in '${args[0]}'`,
                                description: files.join("\n").substring(0, 2045)
                            }
                        })
                    }
                    break
                }
                default: {
                    let store = await bin.get(path + args[0])
                    if (store === null) {
                        msg.channel.send(`The folder \`${args[0]}\` doesn't exist!`)
                    }
                    else if (store.length < 1) {
                        msg.channel.send(`The folder \`${args[0]}\` contains no items!`)
                    }
                    else {
                        let item = store[Math.floor(Math.random() * store.length)]
                        showItem(msg, item)
                    }
                    break
                }
            }
        }
    }
}

function inRange(n, a) {
    if (n > 0 && n <= a.length) return true
    else return false
}

function showItem(msg, item) {
    if (item.startsWith("[") && item.endsWith("]")) {
        msg.channel.send({
            embed: {
                color: 4212432,
                image: {
                    url: item.substring(1, item.length - 1)
                }
            }
        })
    }
    else {
        msg.channel.send(item)
    }
}