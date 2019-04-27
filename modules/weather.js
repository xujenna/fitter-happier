const fetch = require("node-fetch");
const textToSpeech = require('./textToSpeech');
const darkSky = require('../credentials/darksky.json')


async function getWeather(){
    let url = "https://api.darksky.net/forecast/" + darkSky.key + "/40.730808,%20-73.997461"
    let weatherInfo = await fetch(url)
    .then(res => res.json())
    .then(json => {
        let weather = {
            summary: json['hourly']['summary'],
            temp: json['currently']['temperature'],
            precipitation: json['currently']['precipProbability']
        }
        return weather
    })
    await textToSpeech.say("Good morning! The weather summary is: " + weatherInfo.summary + ". It is currently " + weatherInfo.temp + " degrees, with a " + weatherInfo.precipitation + "percent chance of rain.")
}

module.exports = {
    getWeather: getWeather
}