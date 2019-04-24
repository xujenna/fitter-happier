// load modules
const SunCalc = require('suncalc');
const database = require('./modules/datastore');
const textToSpeech = require('./modules/textToSpeech');
const schedule = require('node-schedule');
const rituals = require('./modules/rituals')
const fetch = require("node-fetch");
const fs = require('fs');

textToSpeech.say("I'm awake now.")

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
const FieldTrip = require('./extensions/fieldtrip')


const interventions = {
    'stress' : [
        {'meditations': Meditations},
        {'cuteThings': CuteThings},
        {'poetry': Poetry},
        {'videos': Videos},
        {'exercises': Exercises},
        {'fieldTrip': FieldTrip}
    ],
    'morale': [
        {'poetry': Poetry},
        {'videos': Videos},
        {'fieldTrip': FieldTrip}
    ],
    'mood': [
        {'meditations': Meditations},
        {'interactions': Interactions},
        {'exercises': Exercises},
        {'fieldTrip': FieldTrip}
    ],
    'fatigue': [
        {'exercises': Exercises},
        {'videos': Videos},
        {'interactions': Interactions}
    ]
}



database.runningMeanRef.on('child_added', function(snapshot){
    let newMeanPost = snapshot.val();
    let runningMeanJSON = JSON.parse(fs.readFileSync('runningMean.json', 'utf8'))

    let meanObj = {
        totalMoodPred: newMeanPost.totalMoodPred,
        totalMoralePred: newMeanPost.totalMoralePred,
        totalStressPred: newMeanPost.totalStressPred,
        totalFatiguePred: newMeanPost.totalFatiguePred,
        totalPredictions: newMeanPost.totalPredictions
    }

    runningMeanJSON.push(meanObj)
    runningMeanJSON = JSON.stringify(runningMeanJSON);
    fs.writeFileSync('runningMean.json', runningMeanJSON, 'utf8')
})


database.predictionsRef.on("child_added", function(snapshot){
    let newPost = snapshot.val();
    let currentTime = + new Date();
    let timestamp = newPost.timestamp;

    if((currentTime / 1000) - timestamp <= 2800){
        console.log(newPost)

        let fatiguePrediction = newPost.LSTM_fatigue_prediction;
        let moodPrediction = newPost.LSTM_mood_prediction;
        let moralePrediction = newPost.LSTM_morale_prediction;
        let stressPrediction = newPost.LSTM_stress_prediction;
        let runningMeanJSON = JSON.parse(fs.readFileSync('runningMean.json', 'utf8'))

        let moodMean = runningMeanJSON[runningMeanJSON.length-1].totalMoodPred / runningMeanJSON[runningMeanJSON.length-1].totalPredictions
        let moraleMean = runningMeanJSON[runningMeanJSON.length-1].totalMoralePred / runningMeanJSON[runningMeanJSON.length-1].totalPredictions
        let stressMean = runningMeanJSON[runningMeanJSON.length-1].totalStressPred / runningMeanJSON[runningMeanJSON.length-1].totalPredictions
        let fatigueMean = runningMeanJSON[runningMeanJSON.length-1].totalFatiguePred / runningMeanJSON[runningMeanJSON.length-1].totalPredictions
        console.log("moodMean: " + moodMean)
        console.log("moraleMean: " + moraleMean)
        console.log("stressMean: " + stressMean)
        console.log("fatigueMean: " + fatigueMean)

        if(fatiguePrediction > (fatigueMean) && new Date().getHours() < 7){
            textToSpeech.say("You should go to sleep.")
            database.interventionsRef.push().set({
                timestamp: + timestamp,
                marker: "fatigue",
                prediction: fatiguePrediction,
                intervention: "oral sleep nudge",
                content: "You should go to sleep."
            })
        }
        else if (fatiguePrediction > (fatigueMean)){
            selectIntervention("fatigue", fatiguePrediction, timestamp)
        }
        else if(stressPrediction > (stressMean)){
            selectIntervention("stress", stressPrediction, timestamp)
        }
        else if(moralePrediction < (moraleMean)){
            selectIntervention("morale", moralePrediction, timestamp)
        }
        else if(moodPrediction < (moodMean)){
            selectIntervention("mood", moodPrediction, timestamp)
        }
    }
});

function selectIntervention(marker, prediction, timestamp){
    let selected = Math.round(Math.random() * (interventions[marker].length - 1))
    let SelectedIntervention = Object.values(interventions[marker][selected])[0]
    let intervention = Object.keys(interventions[marker][selected])[0]
    const selectedIntervention = new SelectedIntervention(marker,intervention,timestamp,prediction)
    selectedIntervention.execute()
}