const Intervention = require('./base')
var meditations = require('../selfcare-scripts/meditations.json');

class Meditations extends Intervention {
    async trigger(){
        if(this.marker == "stress"){ 
            let randomIndex = Math.round(Math.random() * (meditations['stress'].length- 1))
            let randomMeditation = meditations['stress'][randomIndex]
            return randomMeditation
        }
        else if(this.marker =="mood"){
            let randomIndex = Math.round(Math.random() * (meditations['mood'].length- 1))
            let randomMeditation = meditations['mood'][randomIndex]
            return randomMeditation
        }
    }

}

module.exports = Meditations