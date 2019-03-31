const Intervention = require('./base')
// let meditations = require('../selfcare-scripts/meditations.json');
const fs = require('fs');
const player = require('play-sound')(opts = {})



class Meditations extends Intervention {
    async execute() {
        const result = await this.trigger(this.marker, this.intervention, this.timestamp, this.prediction)
        this.logIntervention(this.marker, this.intervention, this.timestamp, this.prediction, result)
        player.play(("selfcare-scripts/meditation_recordings/" + this.marker + "/" + result.script), { aplay: ['-D', 'bluealsa:HCI=hci0,DEV=00:00:00:00:88:C8,PROFILE=a2dp'] });
    }

    async trigger(){
        let directory = "selfcare-scripts/meditation_recordings/"
        let meditationInfo = {}
        let options = fs.readdirSync(directory + this.marker)
        let randomIndex = Math.round(Math.random() * (options.length- 1))
        let randomMeditation = options[randomIndex]
        meditationInfo["script"] = randomMeditation
        meditationInfo["title"] = "meditation for " + this.marker
        return meditationInfo
    }

}

module.exports = Meditations