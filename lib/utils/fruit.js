module.exports = {
    getRandomInt
}

// Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
//

// Prototypes
Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
            ;[this[i], this[j]] = [this[j], this[i]]
    }
}
//