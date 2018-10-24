let translate = require('google-translate-api')

module.exports = {
    name: ["toen", "translate"],
    desc: "Translate anything! If only target lang given, source will be auto. If no langs given, it will translate anything to english.",
    permission: "",
    usage: "(target lang) (source lang) ; <text>",
    args: 1,
    command: async function (msg, cmd, args) {
        let target
        let source
        if (args[1] === ";") {
            target = args[0]
            source = "auto"
            args.splice(0, 2)
        }
        else if (args[2] === ";") {
            target = args[0]
            source = args[1]
            args.splice(0, 3)
        }
        else {
            target = "en"
            source = "auto"
        }
        translate(args.join(" "), { from: source, to: target }).then(body => {
            let input = args.join(" ")
            if (body.from.text.autoCorrected) input = body.from.text.value
            msg.channel.send({
                embed: {
                    color: 7303167,
                    title: `${body.from.language.iso.toUpperCase()} to ${target.toUpperCase()}`,
                    description: `From: \`${input}\`\nTo: \`${body.text}\``
                }
            })
        }).catch(err => { return })
    }
}