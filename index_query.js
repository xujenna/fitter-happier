// load modules
const fs = require('fs');
const SunCalc = require('suncalc');
const database = require('./modules/datastore');
const textToSpeech = require('./modules/textToSpeech');
const schedule = require('node-schedule');
const rituals = require('./modules/rituals')
const fetch = require("node-fetch");
const selfCareThings = require('./selfcare-scripts/selfCareThings.json')
const emailer = require('./modules/emailer');

textToSpeech.say("I'm checking for data.")

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

let timestampJSON = JSON.parse(fs.readFileSync('lastReadTimestamps.json', 'utf8'))
let lastReadTimestamp = timestampJSON[timestampJSON.length -1]['lastPostedTimestamp']

database.predictionsRef.orderByChild('timestamp').limitToLast(1).once('value', function(snapshot){
    let newPost = snapshot.val()[Object.keys(snapshot.val())];
    let lastPostedTimestamp = snapshot.val()[Object.keys(snapshot.val())].timestamp;

    if(lastPostedTimestamp == lastReadTimestamp){
        textToSpeech.say("there's no new data.")
        getJoke();
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
        let timestamp = newPost.timestamp;
        console.log(newPost)

        if(fatiguePrediction > 4 && new Date().getHours() < 7){
            textToSpeech.say("You should go to sleep.")
            database.interventionsRef.push().set({
                timestamp: + timestamp,
                marker: "fatigue",
                prediction: fatiguePrediction,
                intervention: "oral sleep nudge",
                content: "You should go to sleep."
            })
            process.exit()
        }
        else if (fatiguePrediction > 3.3){
            selectIntervention("fatigue", fatiguePrediction, timestamp)
        }
        else if(stressPrediction > 1.7){
            selectIntervention("stress", stressPrediction, timestamp)
        }
        else if(moralePrediction < 2.9){
            selectIntervention("morale", moralePrediction, timestamp)
        }
        else if(moodPrediction < 2.8){
            selectIntervention("mood", moodPrediction, timestamp)
        }
        else{
            let randomThing = selfCareThings["reminders"][Math.round(Math.random() * (selfCareThings["reminders"].length - 1))]
            textToSpeech.say("Your mood seems fine! But when was the last time you " + randomThing + "?")
            database.ritualsRef.push().set({
                timestamp: + new Date() / 1000,
                ritual: "random mindfulness",
                content: "Your mood seems fine! But when was the last time you " + randomThing + "?"
            })
            process.exit()
        }
    }
});

async function selectIntervention(marker, prediction, timestamp){
    let selected = Math.round(Math.random() * (interventions[marker].length - 1))
    let SelectedIntervention = Object.values(interventions[marker][selected])[0]
    let intervention = Object.keys(interventions[marker][selected])[0]
    const selectedIntervention = new SelectedIntervention(marker,intervention,timestamp,prediction)
    await selectedIntervention.execute();
    process.exit()
}


async function getJoke(){
    const url = "https://www.reddit.com/r/dadjokes/top.json?sort=top&limit=100"

    let newJoke = await fetch(url)
    .then(res => res.json())
    .then(json => {
        let shortJokeIndices = []
        for(var i = 0; i < 5; i++){
            let randomIndex = Math.round(Math.random() * json['data']['children'].length)
            if(json['data']['children'][randomIndex]['data']['selftext'].length < 350){
                shortJokeIndices.push(randomIndex)
            }
        }
        let jokeTitle = json['data']['children'][shortJokeIndices[1]]['data']['title']
        let jokeText = json['data']['children'][shortJokeIndices[1]]['data']['selftext']
        let joke = {
            jokeTitle: jokeTitle,
            jokeText: jokeText
        }
        return joke
    })
    textToSpeech.say("Tell someone this joke: " + newJoke.jokeTitle + "..." + newJoke.jokeText)
    emailer.emailContent(newJoke.jokeTitle, newJoke.jokeText)

    database.ritualsRef.push().set({
        timestamp: + new Date() / 1000,
        ritual: "random joke",
        content: newJoke.jokeTitle + "..." + newJoke.jokeText
    })
    process.exit()
}