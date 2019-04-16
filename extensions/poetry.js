const Intervention = require('./base')
var poetry = require('../selfcare-scripts/poetry.json');
const emailer = require('../modules/emailer');
const textToSpeech = require('../modules/textToSpeech');

class Poetry extends Intervention {

    async trigger(){
        let poem = poetry[Math.round(Math.random() * (poetry.length - 1))]
        await emailer.emailContent((poem['title'] + " by " + poem['author']), poem['script'])
        let poemInfo= {
            title: poem['title'] + " by " + poem['author'],
            script: "I've sent you a poem by " + poem['author']
        }
        return poemInfo
    }
}

module.exports = Poetry