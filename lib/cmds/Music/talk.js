let key = process.env.API_GTTS
let got = require("got")

module.exports = {
    name: ["talk", "ftalk"],
    desc: "Make the bot say something in Text-To-Speech VERSION 22222!",
    permission: "",
    usage: "<message>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (doChecks(checks, msg, 3)) return
        if (!voice[msg.guild.id].chan) {
            voice[msg.guild.id].chan = msg.member.voiceChannel
            voice[msg.guild.id].conn = await voice[msg.guild.id].chan.join()
        }
        if (voice[msg.guild.id].queue && voice[msg.guild.id].queue.length) {
            let last = 1
            if (cmd === "ftalk") voice[msg.guild.id].queue.splice(1, 0, await textToSpeech(args.join(" ")))
            else {
                voice[msg.guild.id].queue.push(await textToSpeech(args.join(" ")))
                last = voice[msg.guild.id].queue.length - 1
            }
            showPlayMessage(msg, "Added to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
        }
        else {
            voice[msg.guild.id].queue = []
            voice[msg.guild.id].queue.push(await textToSpeech(args.join(" ")))
            voice[msg.guild.id].msg = msg
            playQueue(msg)
        }
    }
}

async function textToSpeech(text, lang, name, gender) {
    try {
        let url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize"
        lang = lang || "en-US"
        name = name || "en-US-Wavenet-F"
        gender = gender || "FEMALE"
        let body = (await got(url, {
            method: "POST",
            query: {
                key: key
            },
            body: {
                input: {
                    text: text
                },
                voice: {
                    languageCode: lang,
                    name: name,
                    ssmlGender: gender
                },
                audioConfig: {
                    audioEncoding: "LINEAR16",
                    speakingRate: 1.0,
                    pitch: 0.0,
                    volumeGainDb: 0.0
                }
            },
            json: true
        })).body.audioContent
        return {
            type: "base64",
            link: "",
            data: body,
            name: text
        }
    }
    catch (e) {
        return { error: "Something went wrong!" }
    }
}