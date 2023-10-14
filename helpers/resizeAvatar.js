const jimp = require("jimp");

const resizeAvatar = async (file) => {
    jimp.read(file)
        .then(image => {
            image
                .resize(250, 250)
                .write(file);
        })
        .catch(err => {
            console.log("error jimp", err)
        });
};

module.exports = resizeAvatar;