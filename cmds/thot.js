let got = require("got");
let jimp = require("jimp");
let api_face = process.env.API_FACE;
let secret_face = process.env.SECRET_FACE;

module.exports = {
    name: ["thot"],
    desc: "Adds the snapchat dog filter to an image.",
    permission: "",
    usage: "<url>",
    args: 1,
    command: async function (msg, cmd, args) {
        try {
            let img = await jimp.read(args[0]);
            let data = await detectFace(args[0]);
            if (data.hasOwnProperty("error_message")) {
                msg.channel.send("Error: " + data.error_message);
                return;
            }
            for (let i = 0; i < data.faces.length; i++) {
                if (data.faces[i].attributes == undefined) continue;
                if (data.faces[i].landmark == undefined) continue;
                let face = {
                    box: data.faces[i].face_rectangle,
                    rot: data.faces[i].attributes.headpose,
                    lEye: data.faces[i].landmark.left_eye_center,
                    rEye: data.faces[i].landmark.right_eye_center,
                    nose: data.faces[i].landmark.nose_tip,
                    mouth: data.faces[i].landmark.mouth_upper_lip_bottom
                };
                let parts = [
                    await jimp.read("./data/assets/thot/left_ear.png"),
                    await jimp.read("./data/assets/thot/right_ear.png"),
                    await jimp.read("./data/assets/thot/nose.png"),
                    await jimp.read("./data/assets/thot/tongue.png")
                ];
                for (let i = 0; i < parts.length; i++) {
                    parts[i].scaleToFit(face.box.width, face.box.height);
                    parts[i].rotate(face.rot.roll_angle);

                }
                img.composite(parts[0], face.lEye.x - (parts[0].bitmap.width / 1.5), face.lEye.y - (parts[0].bitmap.height / 1.5));
                img.composite(parts[1], face.rEye.x - (parts[1].bitmap.width / 3), face.rEye.y - (parts[1].bitmap.height / 1.5));
                img.composite(parts[2], face.nose.x - (parts[2].bitmap.width / 2), face.nose.y - (parts[2].bitmap.height / 2));
                img.composite(parts[3], face.mouth.x - (parts[3].bitmap.width / 2), face.mouth.y - (parts[3].bitmap.height / 2));
            }
            let file = `./data/temp/thot_${msg.author.id}.jpg`;
            img.write(file, function (err) {
                if (err) { console.log(err); msg.channel.send("Something went wrong!"); return; }
                msg.channel.send({ file: file });
            });
        } catch (e) { console.log(e); msg.channel.send("Invalid URL!"); }
    }
}

async function detectFace(img) {
    let url = "https://api-us.faceplusplus.com/facepp/v3/detect";
    try {
        let body = (await got.post(url, {
            body: {
                api_key: api_face,
                api_secret: secret_face,
                image_url: img,
                return_landmark: 1,
                return_attributes: "headpose"
            },
            form: true,
            json: true
        })).body;
        return body;
    } catch (e) { return e.response.body; }
}