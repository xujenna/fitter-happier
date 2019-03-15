const Intervention = require('./base')

class Seal extends Intervention {
    async trigger() {
        const promise = new Promise((resolve, reject) => {
            console.log('SENDING GIF')
            setTimeout(() => {
                resolve(this.params)
            }, 3000)
        })

        const gif = await promise
        return gif
    }

    getScript(result) {
        return `I sent you a gif of a ${result}`
    }
}

module.exports = Seal