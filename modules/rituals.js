const rituals = require('../selfcare-scripts/rituals.json')
var schedule = require('node-schedule');
const textToSpeech = require('../modules/textToSpeech');
const emailer = require('./emailer');
const database = require('../modules/datastore');
const fetch = require("node-fetch");
const selfCareThings = require('../selfcare-scripts/selfCareThings.json')


function setRitualAlarms(sunTimes){
    // daily noonday walk
    var sunSalutationRule = new schedule.RecurrenceRule();
    sunSalutationRule.hour = sunTimes.solarNoon.getHours();
    sunSalutationRule.minute = new Date(sunTimes.solarNoon - (15 * 60000)).getMinutes();
    console.log("sun salutation: " + sunSalutationRule.hour + ":"+sunSalutationRule.minute)
    schedule.scheduleJob(sunSalutationRule, function(){
        textToSpeech.say("Go out for your sun salutation.")
        emailer.emailContent("Go out for your sun salutation.", "Do it!")

        database.ritualsRef.push().set({
            timestamp: + new Date() / 1000,
            ritual: "sun salutation",
            content: "Go out for your sun salutation."
        })
    })

    // daily step goal completion
    var sweetLightRule = new schedule.RecurrenceRule();
    sweetLightRule.hour = sunTimes.goldenHour.getHours();
    sweetLightRule.minute = new Date(sunTimes.goldenHour - (15 * 60000)).getMinutes();
    console.log("sweet light: " + sweetLightRule.hour + ":"+sweetLightRule.minute)
    schedule.scheduleJob(sweetLightRule, function(){
        textToSpeech.say("Go out and meet your step goal.")
        emailer.emailContent("Go out and meet your step goal.", "Do it!")

        database.ritualsRef.push().set({
            timestamp: + new Date() / 1000,
            ritual: "sweet light walk",
            content: "Go out and meet your step goal."
        })
    })

    // random question
    var randomQuestionRule = new schedule.RecurrenceRule();
    // let randomHour = parseInt(sunTimes.sunrise.getMinutes().toString().split('').pop())
    randomQuestionRule.hour = sunSalutationRule.hour + Math.round(Math.random() * 2) + 2;
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

    // random joke
    var randomJokeRule = new schedule.RecurrenceRule();
    // let randomHour2 = Math.round(Math.random() * 3)
    // randomJokeRule.hour = sunTimes.dusk.getHours() + randomHour2;
    randomJokeRule.minute = sunTimes.dusk.getMinutes();

    console.log("random joke: " + randomJokeRule.minute + " minutes after the hour")

    schedule.scheduleJob(randomJokeRule, getJoke);
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
    }

    // daily Chinese
    var dailyChineseRule = new schedule.RecurrenceRule();
    let randomHour3 = Math.round(Math.random() * 2) + 1
    dailyChineseRule.hour = sunTimes.solarNoon.getHours() - randomHour3;
    dailyChineseRule.minute = sunTimes.sunrise.getMinutes();

    console.log("daily chinese practice: " + dailyChineseRule.hour + ":"+dailyChineseRule.minute)
    schedule.scheduleJob(dailyChineseRule, practiceChinese);

    async function practiceChinese(){
        textToSpeech.say("do a chinese lesson")
        emailer.emailContent("Do a Chinese lesson", "Do it!")
        database.ritualsRef.push().set({
            timestamp: + new Date() / 1000,
            ritual: "daily chinese practice",
            content: "duolingo lesson"
        })
    }

    schedule.scheduleJob('*/25 * * * *', function(){
        let randomThing = selfCareThings["reminders"][Math.round(Math.random() * (selfCareThings["reminders"].length - 1))]
        textToSpeech.say("When was the last time you " + randomThing + "?")
        database.ritualsRef.push().set({
            timestamp: + new Date() / 1000,
            ritual: "random mindfulness",
            content: "When was the last time you " + randomThing + "?"
        })
      });

    emailSchedule(dailyChineseRule, sunSalutationRule, randomQuestionRule, randomJokeRule, sweetLightRule)
}

function emailSchedule(dailyChineseRule, sunSalutationRule, randomQuestionRule, randomJokeRule, sweetLightRule){
    let emailBody = ["daily chinese practice: " + dailyChineseRule.hour + ":"+dailyChineseRule.minute, "sun salutation: " + sunSalutationRule.hour + ":"+sunSalutationRule.minute, "random question: " + randomQuestionRule.hour + ":"+randomQuestionRule.minute, "random joke: " + randomJokeRule.minute + " minutes after the hour", "sweet light: " + sweetLightRule.hour + ":"+sweetLightRule.minute]
    emailer.emailContent("Here's today's ritual schedule", emailBody)
}

module.exports = {
    setRitualAlarms: setRitualAlarms
}
