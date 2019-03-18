const Intervention = require('./base')
var poetry = require('../selfcare-scripts/poetry.json');
const emailer = require('../modules/emailer');

class Poetry extends Intervention {
    async trigger(){
        let poem = poetry[Math.round(Math.random() * (poetry.length - 1))]
        emailer.emailContent((poem['title'] + " by " + poem['author']), poem['script'])
        return poem
    }
}

module.exports = Poetry