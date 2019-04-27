const Intervention = require('./base')
// let meditations = require('../selfcare-scripts/meditations.json');
const fs = require('fs');
const player = require('play-sound')(opts = {})
const textToSpeech = require('../modules/textToSpeech');

class Meditations extends Intervention {
    async execute() {
        const result = await this.trigger(this.marker, this.intervention, this.timestamp, this.prediction)
        await this.logIntervention(this.marker, this.intervention, this.timestamp, this.prediction, result)
        await textToSpeech.say("Let's do a quick meditation.")
            player.play(("selfcare-scripts/meditation_recordings/" + this.marker + "/" + result.script), { aplay: ['-D', 'bluealsa:HCI=hci0,DEV=53:B7:C7:01:02:F2,PROFILE=a2dp'] });
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