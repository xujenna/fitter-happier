// load modules
const fs = require('fs');
const SunCalc = require('suncalc');
const database = require('./modules/datastore');
const textToSpeech = require('./modules/textToSpeech');
const schedule = require('node-schedule');
const rituals = require('./modules/rituals')
const fetch = require("node-fetch");

textToSpeech.say("I'm checking the database.")

// RITUALS
// get sun times on boot, schedule rituals
var sunTimes = SunCalc.getTimes(new Date(), 40.7, -74)
rituals.setRitualAlarms(sunTimes)

// INTERVENTIONS
// load extensions
const Meditations = require('./extensions/meditations')
const CuteThings = require('./extensions/seal')
const Poetry = require('./extensions/poetry')
const Videos = require('./extensions/videos')
const Exercises = require('./extensions/exercises')
const Interactions = require('./extensions/interactions')

const interventions = {
    'stress' : [
        {'meditations': Meditations},
        {'cuteThings': CuteThings},
        {'poetry': Poetry},
        {'videos': Videos},
        {'exercises': Exercises}
        // random location
    ],
    'morale': [
        {'poetry': Poetry},
        {'videos': Videos}
    ],
    'mood': [
        {'meditations': Meditations}, // play audio for this
        {'interactions': Interactions},
        {'exercises': Exercises}
        // random location
    ],
    'fatigue': [
        {'poetry': Poetry},
        {'exercises': Exercises}
    ]
}

let timestampJSON = JSON.parse(fs.readFileSync('lastReadTimestamps.json', 'utf8'))
let lastReadTimestamp = timestampJSON[timestampJSON.length -1]['lastPostedTimestamp']

database.predictionsRef.orderByChild('timestamp').limitToLast(1).once('value', function(snapshot){
    let newPost = snapshot.val();
    let lastPostedTimestamp = snapshot.val()[Object.keys(snapshot.val())].timestamp;

    if(lastPostedTimestamp == lastReadTimestamp){
        process.exit();
    }
    else if(lastPostedTimestamp > lastReadTimestamp){
        let obj = {
            lastPostedTimestamp: lastPostedTimestamp
        }
        timestampJSON.push(obj)
        timestampJSON = JSON.stringify(timestampJSON);
        console.log(timestampJSON)
        fs.writeFileSync('lastReadTimestamps.json', timestampJSON, 'utf8')

        let fatiguePrediction = newPost.LSTM_fatigue_prediction;
        let moodPrediction = newPost.LSTM_mood_prediction;
        let moralePrediction = newPost.LSTM_morale_prediction;
        let stressPrediction = newPost.LSTM_stress_prediction;

        if(fatiguePrediction > 3.3 && new Date().getHours() < 7){
            textToSpeech.say("You should go to sleep.")
            database.interventionsRef.push().set({
                timestamp: + timestamp,
                marker: "fatigue",
                prediction: fatiguePrediction,
                intervention: "oral sleep nudge",
                content: "You should go to sleep."
            })
        }
        else if (fatiguePrediction > 3.3){
            selectIntervention("fatigue", fatiguePrediction, timestamp)
        }
        else if(stressPrediction > 1.8){
            selectIntervention("stress", stressPrediction, timestamp)
        }
        else if(moralePrediction < 2.9){
            selectIntervention("morale", moralePrediction, timestamp)
        }
        else if(moodPrediction < 2.8){
            selectIntervention("mood", moodPrediction, timestamp)
        }
        else{
            process.exit()
        }
    }
});

function selectIntervention(marker, prediction, timestamp){
    let selected = Math.round(Math.random() * (interventions[marker].length - 1))
    let SelectedIntervention = Object.values(interventions[marker][selected])[0]
    let intervention = Object.keys(interventions[marker][selected])[0]
    const selectedIntervention = new SelectedIntervention(marker,intervention,timestamp,prediction)
    selectedIntervention.execute()
    process.exit()
}
