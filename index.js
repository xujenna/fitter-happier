// load modules
var SunCalc = require('suncalc');
const database = require('./modules/datastore');
const textToSpeech = require('./modules/textToSpeech');
const emailer = require('./modules/emailer');
var schedule = require('node-schedule');
const rituals = require('./rituals.json')

// scheduler doc https://www.npmjs.com/package/node-schedule?fbclid=IwAR1CIFKpVSoSLSwzXNzwfvVtRK1n5OWv24tpjC2BNTK4mZx1jL4vy2Zi2eo


// get daily sun times
var sunTimesRule = new schedule.RecurrenceRule();
sunTimesRule.hour = 10;
sunTimesRule.minute = 00;

schedule.scheduleJob(sunTimesRule, function(sunTimes) {
    var sunTimes = SunCalc.getTimes(new Date(), 40.7, -74)
    setAlarms(sunTimes)
});

function setAlarms(sunTimes){
    // daily noonday walk
    var sunSalutationRule = new schedule.RecurrenceRule();
    sunSalutationRule.hour = sunTimes.solarNoon.getHours();
    sunSalutationRule.minute = new Date(sunTimes.solarNoon - (15 * 60000)).getMinutes();
    console.log("sun salutation: " + sunSalutationRule.hour + ":"+sunSalutationRule.minute)
    schedule.scheduleJob(sunSalutationRule, function(){
        textToSpeech.say("Go out for your sun salutation.")
    })

    // daily step goal completion
    var sweetLightRule = new schedule.RecurrenceRule();
    sweetLightRule.hour = sunTimes.goldenHour.getHours();
    sweetLightRule.minute = new Date(sunTimes.goldenHour - (15 * 60000)).getMinutes();
    console.log("sweet light: " + sweetLightRule.hour + ":"+sweetLightRule.minute)
    schedule.scheduleJob(sweetLightRule, function(){
        textToSpeech.say("Sweet light starts in ten minutes. Go out and meet your step goal.")
    })

    // random question
    var randomQuestionRule = new schedule.RecurrenceRule();
    let randomHour = parseInt(sunTimes.azimuth.toString().split('').pop());
    randomQuestionRule.hour = sunTimes.night.getHours() - randomHour;
    randomQuestionRule.minute = sunTimes.night.getMinutes();

    console.log("random question: " + randomQuestionRule.hour + ":"+randomQuestionRule.minute)

    schedule.scheduleJob(randomQuestionRule, function(){
        let randomNum = Math.round(Math.random() * (rituals['social']['questions'].length - 1))
        let randomQ = rituals['social']['questions'][randomNum]

        textToSpeech.say("Count to " +randomNum+ " people and ask them, " +randomQ)

        emailer.emailContent(("Question for person #" +randomNum), randomQ)

        database.ritualsRef.push().set({
            timestamp: + new Date() / 1000,
            ritual: "random question",
            content: randomQ
        })
    })
}


// load interventions
var poetry = require('./poetry.json');
var meditation = require('./meditations.json');
var exercise = require('./exercises.json');

// interventions by marker
// const moodInterventions = [interactions, goodThings, meditation.mood]
// const moraleInterventions = [poetry, videos]
// const stressInterventions = [poetry, videos.cute, videos.asmr, exercise.workouts, exercise.dance, meditation.stress]
// const fatigueInterventions = [poetry, exercise.dance, meditation.stress]
const moraleInterventions = [poetry]


database.predictionsRef.on("child_added", function(snapshot){
    var newPost = snapshot.val();
    var fatiguePrediction = newPost.LSTM_fatigue_prediction;
    var moodPrediction = newPost.LSTM_mood_prediction;
    var moralePrediction = newPost.LSTM_morale_prediction;
    var stressPrediction = newPost.LSTM_stress_prediction;
    var timestamp = newPost.timestamp;
    
    var currentTime = + new Date();
    // var sunTimes = SunCalc.getTimes(currentTime, 40.7, -74)

    if((currentTime / 1000) - timestamp <= 3700){
            console.log(newPost)

        if(fatiguePrediction > 3.75){
            fatigueIntervention(fatiguePrediction, timestamp);
        }
        else if(moralePrediction < 2.95){
            moraleIntervention(moralePrediction, timestamp);
        }
    }
});


function fatigueIntervention(prediction, timestamp){
    console.log("Your fatigue prediction is "+prediction+ ". You should take a walk.")
    textToSpeech.say("You should take a walk.")

    // interventionsRef.push().set(interventionObjTK)
}

function moraleIntervention(prediction, timestamp){
    console.log("Your morale prediction is "+prediction+ ".\n")

    // switch (Math.round(Math.random() * moraleInterventions.length)) {
    //     case 0:
            let poet = poetry[Math.round(Math.random() * (poetry.length - 1))]
            let poem = poet.poems[Math.round(Math.random() * (poet['poems'].length - 1))];
            
            // console.log(poem.title + '\n');
            // textToSpeech.say(poem.title);
            // textToSpeech.say(poem.text);
            // poem['text'].forEach(d =>{
            //     console.log(String(d));
            //     var cleaned = String(d.replace("'", '').replace(';', '').replace(':', '').replace('?', ''))
            //     textToSpeech.say(cleaned+ "<break time='200ms'/>");
            // })
            emailer.emailContent((poem['title'] + " by " + poet['poet']), poem['text'])
            textToSpeech.say("I emailed you a poem by " + poet.poet)

            database.interventionsRef.push().set({
                timestamp: timestamp,
                marker: "morale",
                prediction: prediction,
                intervention: "poetry",
                content: poem
            })
            // break;

        // case 1:
        //     // spotify API 
        //     break;
        // case 2:
        //     // email videos
        //     break;
        // case 3:
        //     console.log("last has no break")

    // }
}

function stressIntervention(prediction){
    // interventionsRef.push().set(interventionObjTK)

}