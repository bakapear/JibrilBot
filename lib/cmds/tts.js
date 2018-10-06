let tts = require("google-tts-api")
module.exports = {
    name: ["tts", "ftts"],
    desc: "Make the bot say something in Text-To-Speech!",
    permission: "",
    usage: "(language) ; <message>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 3)) return
        if (!voice[msg.guild.id].chan) {
            voice[msg.guild.id].chan = msg.member.voiceChannel
            voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
        }
        if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
            let last = 1
            if (cmd === "ftts") voice[msg.guild.id].queue.splice(1, 0, await getTTSUrl(args))
            else {
                voice[msg.guild.id].queue.push(await getTTSUrl(args))
                last = voice[msg.guild.id].queue.length - 1
            }
            showPlayMessage(msg, "Added to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
        }
        else {
            voice[msg.guild.id].queue = []
            voice[msg.guild.id].queue.push(await getTTSUrl(args))
            voice[msg.guild.id].msg = msg
            playQueue(msg)
        }
    }
}

async function getTTSUrl(args) {
    let lang = "en"
    if (args[1] === ";") {
        lang = args[0]
        args.splice(0, 2)
    }
    let url = await tts(args.join(" ").substring(0, 200), lang, 1)
    return {
        type: "tts",
        link: url,
        name: args.join(" ")
    }
}