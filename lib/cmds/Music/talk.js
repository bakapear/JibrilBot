let key = process.env.API_GTTS
let got = require("got")

module.exports = {
    name: ["talk", "ftalk", "ssml", "fssml"],
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
            if (cmd === "ftalk" || cmd === "fssml") voice[msg.guild.id].queue.splice(1, 0, await textToSpeech(args.join(" "), cmd === "fssml"))
            else {
                voice[msg.guild.id].queue.push(await textToSpeech(args.join(" "), cmd === "ssml"))
                last = voice[msg.guild.id].queue.length - 1
            }
            showPlayMessage(msg, "Added to Queue", voice[msg.guild.id].queue[last].name, voice[msg.guild.id].queue[last].link, voice[msg.guild.id].queue[last].img)
        }
        else {
            voice[msg.guild.id].queue = []
            voice[msg.guild.id].queue.push(await textToSpeech(args.join(" "), cmd === "ssml"))
            voice[msg.guild.id].msg = msg
            playQueue(msg)
        }
    }
}

async function textToSpeech(text, ssml, lang, name, gender, speed, pitch, volume) {
    try {
        let url = "https://texttospeech.googleapis.com/v1beta1/text:synthesize"
        lang = lang || "en-US"
        name = name || "en-US-Wavenet-F"
        gender = gender || "FEMALE"
        speed = speed || 1.0
        pitch = pitch || 0.0
        volume = volume || 0.0
        let opts = {
            method: "POST",
            query: {
                key: key
            },
            body: {
                input: {},
                voice: {
                    languageCode: lang,
                    name: name,
                    ssmlGender: gender
                },
                audioConfig: {
                    audioEncoding: "LINEAR16",
                    speakingRate: speed,
                    pitch: pitch,
                    volumeGainDb: volume
                }
            },
            json: true
        }
        if (ssml) opts.body.input.ssml = text
        else opts.body.input.text = text

        let body = (await got(url, opts)).body.audioContent
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