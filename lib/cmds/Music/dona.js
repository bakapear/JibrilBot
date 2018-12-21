let got = require("got")

module.exports = {
    name: ["fdona", "dona"],
    desc: "Make the bot say something in Text-To-Speech the IIIrd\nVoices: Brian,Ivy,Justin,Russell,Nicole,Emma,Amy,Joanna,Salli,Kimberly,Kendra,Joey,Mizuki,Chantal,Mathieu,Maxim,Raveena",
    permission: "",
    usage: "<voice> <message>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 3)) return
        if (!voice[msg.guild.id].chan) {
            voice[msg.guild.id].chan = msg.member.voiceChannel
            voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
        }
        if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
            let last = 1
            if (cmd === "fdona") voice[msg.guild.id].queue.splice(1, 0, await textToSpeech(args))
            else {
                voice[msg.guild.id].queue.push(await textToSpeech(args))
                last = voice[msg.guild.id].queue.length - 1
            }
            showPlayMessage(msg, "Added to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
        }
        else {
            voice[msg.guild.id].queue = []
            voice[msg.guild.id].queue.push(await textToSpeech(args))
            voice[msg.guild.id].msg = msg
            playQueue(msg)
        }
    }
}

async function textToSpeech(args) {
    let voice = "Justin"
    if (args[1] === ";") {
        voice = args[0]
        args.splice(0, 2)
    }
    try {
        let url = "https://us-central1-sunlit-context-217400.cloudfunctions.net/streamlabs-tts"
        let body = (await got(url, {
            method: "POST",
            body: {
                voice: voice,
                text: args.join(" ")
            },
            json: true
        })).body
        if (!body.success) return { error: "Something went wrong!" }
        return {
            type: "file",
            link: body.speak_url,
            name: args.join(" ")
        }
    }
    catch (e) {
        return { error: "Something went wrong!" }
    }
}