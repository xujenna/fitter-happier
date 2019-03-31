const Intervention = require('./base')
var poetry = require('../selfcare-scripts/poetry.json');
const emailer = require('../modules/emailer');

class Poetry extends Intervention {

    async execute() {
        const result = await this.trigger(this.marker, this.intervention, this.timestamp, this.prediction)
        console.log("execute " + result.title + ", " + result.script)
        this.logIntervention(this.marker, this.intervention, this.timestamp, this.prediction, result)
        textToSpeech.say(`${this.getScript(result.script)}`)
        return true
    }

    async trigger(){
        let poem = poetry[Math.round(Math.random() * (poetry.length - 1))]
        emailer.emailContent((poem['title'] + " by " + poem['author']), poem['script'])
        let poemInfo= {
            title: poem['title'] + " by " + poem['author'],
            script: "I've sent you a poem by " + poem['author']
        }
        return poemInfo
    }
}

module.exports = Poetry