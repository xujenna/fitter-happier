const rituals = require('./selfcare-scripts/rituals.json')
var schedule = require('node-schedule');
const textToSpeech = require('./modules/textToSpeech');
const emailer = require('./modules/emailer');
const database = require('./modules/datastore');
const SunCalc = require('suncalc');
const fetch = require("node-fetch");
const calendar = require('./modules/calendar')
const weather = require('./modules/weather')

const player = require('play-sound')(opts = {})

// RITUALS
// get sun times on boot, schedule rituals
var sunTimes = SunCalc.getTimes(new Date(), 40.730808, -73.997461)
setRitualAlarms(sunTimes)

// re-schedule in the morning
var sunTimesRule = new schedule.RecurrenceRule();
sunTimesRule.hour = 8;
sunTimesRule.minute = 45;

schedule.scheduleJob(sunTimesRule, function(sunTimes) {
    var sunTimes = SunCalc.getTimes(new Date(), 40.7, -74)
    rituals.setRitualAlarms(sunTimes)
});

textToSpeech.say("I'm awake now.")

// Waking ritual
if(new Date().getHours() > 7 && new Date().getHours() < 14){
    weather.getWeather();
    calendar.readEvents();
    setTimeout(() => {
        textToSpeech.say("Please sit upright for your meditation.")
        player.play(("selfcare-scripts/meditation_recordings/mood/LovingKindness.wav") , { aplay: ['-D', 'bluealsa:HCI=hci0,DEV=53:B7:C7:01:02:F2,PROFILE=a2dp'] });
    }, 30000);
}


function setRitualAlarms(sunTimes){
    // daily noonday walk
    var sunSalutationRule = new schedule.RecurrenceRule();
    sunSalutationRule.hour = sunTimes.solarNoon.getHours();
    sunSalutationRule.minute = new Date(sunTimes.solarNoon - (15 * 60000)).getMinutes();
    console.log("sun salutation: " + sunSalutationRule.hour + ":"+sunSalutationRule.minute)
    schedule.scheduleJob(sunSalutationRule, function(){
        textToSpeech.say("Go out for your sun salutation.")
        weather.getWeather();
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
        weather.getWeather();
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

    emailSchedule(dailyChineseRule, sunSalutationRule, randomQuestionRule, sweetLightRule)
}

function emailSchedule(dailyChineseRule, sunSalutationRule, randomQuestionRule, sweetLightRule){
    let emailBody = ["daily chinese practice: " + dailyChineseRule.hour + ":"+dailyChineseRule.minute, "sun salutation: " + sunSalutationRule.hour + ":"+sunSalutationRule.minute, "random question: " + randomQuestionRule.hour + ":"+randomQuestionRule.minute, "sweet light: " + sweetLightRule.hour + ":"+sweetLightRule.minute]
    emailer.emailContent("Here's today's ritual schedule", emailBody)
}