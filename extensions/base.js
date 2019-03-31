const textToSpeech = require('../modules/textToSpeech');
const database = require('../modules/datastore');

class Intervention {
    constructor(marker,intervention,timestamp,prediction) {
        this.marker = marker,
        this.intervention = intervention,
        this.timestamp = timestamp,
        this.prediction = prediction
    }

    async execute() {
        const result = await this.trigger(this.marker, this.intervention, this.timestamp, this.prediction)
        console.log("execute " + result.title + ", " + result.script)
        this.logIntervention(this.marker, this.intervention, this.timestamp, this.prediction, result)
        textToSpeech.say(`${this.getScript(result.script)}`)
        return true
    }

    async trigger(params) {
        return true
        // trigger intervention
    }

    getScript(result) {
        if(result)
            return result
        else
            return 'something broke, typical...'
        // return formatted script
    }

    logIntervention(marker, intervention, timestamp, prediction, result){
        database.interventionsRef.push().set({
            timestamp: + timestamp,
            marker: marker,
            prediction: prediction,
            intervention: intervention,
            content: result.title
        })
    }
}

module.exports = Intervention
// new Intervention('breathing-exercise', "Breath!", {breath: true, duration: 100000})
