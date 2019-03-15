const Intervention = require('./base')

class Breathing extends Intervention {
    getScript() {
        return `Breathe for ${this.params.count} seconds`
    }
}

module.exports = Breathing