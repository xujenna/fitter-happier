const Intervention = require('./base')
var exercises = require('../selfcare-scripts/exercises.json');
const emailer = require('../modules/emailer');

class Exercises extends Intervention {
    async trigger(){
        if(this.marker == "stress" || this.marker == "mood"){ 
            let randomIndex;
            let randomExercise;
            switch(Math.round(Math.random())){
                case 0:
                    randomIndex = Math.round(Math.random() * (exercises['workouts'].length- 1))
                    randomExercise = exercises['workouts'][randomIndex]
                    emailer.emailContent(randomExercise.title, randomExercise.script)
                    break;
                case 1:
                    randomIndex = Math.round(Math.random() * (exercises['danceTracks'].length- 1))
                    randomExercise = exercises['danceTracks'][randomIndex]
                    emailer.emailContent("Let's dance!", randomExercise.link)
            }
            return randomExercise
        }
        else if(this.marker =="fatigue"){
            let randomIndex = Math.round(Math.random() * (exercises['danceTracks'].length- 1))
            let randomExercise = exercises['danceTracks'][randomIndex]
            await emailer.emailContent("Let's dance!", randomExercise.link)
            return randomExercise
        }
    }
}

module.exports = Exercises