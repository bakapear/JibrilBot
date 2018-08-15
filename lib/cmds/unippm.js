let got = require("got")

module.exports = {
    name: ["uni", "unippm"],
    desc: "Plays a track from UNIPPM.",
    permission: "",
    usage: "<query>",
    args: 1,
    command: async function (msg, cmd, args) {
        if (!voiceq.hasOwnProperty(msg.guild.id)) voiceq[msg.guild.id] = [], voiceq[msg.guild.id].songs = [], voiceq[msg.guild.id].playing = 0;
        if (!msg.member.voiceChannel) { msg.channel.send("You're not in a voice channel!"); return }
        if (voiceq[msg.guild.id].playing !== 0) { msg.channel.send("Something is already playing!"); return; }
        let res = await getUniTrack(args.join(" "), msg.content.startsWith(".") ? true : false)
        if (res === null) {
            msg.channel.send("Nothing found!")
        }
        else {
            msg.member.voiceChannel.join().then(connection => {
                voiceq[msg.guild.id].playing = "unippm";
                playSound(msg, connection, res);
            });
        }
    }
}

async function getUniTrack(args, rnd) {
    let query = {
        q: "(" + args + ")",
        qf: [
            "tagsLowercase^4",
            "tagsHiddenLowercase^4",
            "tagsNGram^4",
            "tagsTokenised^4",
            "trackDescription^4",
            "albumNumberNGram^2",
            "releaseDate^2",
            "labelId^2",
            "albumId^2",
            "workId^2",
            "versionId^2",
            "composers"
        ],
        sort: "score desc,releaseDate desc,trackTitleRaw asc",
        group: true,
        "group.field": "workIdAndAlbumId",
        "group.ngroups": true,
        "group.facet": true,
        "group.sort": "versionTypeOrderId asc, bestWorkAudioDurationOrderId asc, bestWorkAudioActualDuration desc, trackNoFloat asc",
        spellcheck: "off",
        start: 0,
        rows: 20,
        "q.op": "AND",
        pf: "composers^32"
    }
    let url = "https://cloud1.search.universalproductionmusic.com/uppm_work_3_1/select" + formatOldQuery(query)
    let body = (await got(url, {
        json: true
    })).body
    if (body.grouped.workIdAndAlbumId.matches === 0) return null
    if (rnd) {
        let mod = Math.floor(Math.random() * body.grouped.workIdAndAlbumId.groups.length)
        return { name: body.grouped.workIdAndAlbumId.groups[mod].doclist.docs[0].tt, song: body.grouped.workIdAndAlbumId.groups[mod].doclist.docs[0].wa[0].a }
    }
    else return { name: body.grouped.workIdAndAlbumId.groups[0].doclist.docs[0].tt, song: body.grouped.workIdAndAlbumId.groups[0].doclist.docs[0].wa[0].a }
}

function formatOldQuery(obj) {
    let params = []
    for (let prop in obj) {
        if (obj[prop].constructor === Array) {
            for (let i = 0; i < obj[prop].length; i++) {
                params.push(prop + "=" + encodeURIComponent(obj[prop][i]))
            }
        }
        else params.push(prop + "=" + encodeURIComponent(obj[prop]))
    }
    return "?" + params.join("&")
}

function printSound(msg, link, name) {
    msg.channel.send({
        embed: {
            color: 14506163,
            title: "Playing Sound",
            url: link,
            description: "\`" + name + "\`"
        }
    });
}

function playSound(msg, connection, res) {
    printSound(msg, res.song, res.name);
    dispatcher = connection.playArbitraryInput(res.song);
    dispatcher.setBitrate(96000);
    dispatcher.on("start", () => {
        connection.player.streamingData.pausedTime = 0;
    });
    dispatcher.on("end", () => {
        dispatcher = null;
        voiceq[msg.guild.id].playing = 0;
    });
}