const Intervention = require('./base')
const rituals = require('../selfcare-scripts/rituals.json')
const emailer = require('../modules/emailer');
const fetch = require("node-fetch");

class Interactions extends Intervention {

    async trigger() {
        let interactionInfo = {}
        const riddlesUrl = "https://www.reddit.com/r/riddles/new.json?sort=new&limit=100"
        const jokesUrl = "https://www.reddit.com/r/Jokes/new.json?sort=new&limit=100"

        switch(Math.round(Math.random() * 3)){
            case 0:
                interactionInfo['title'] = "compliment"
                interactionInfo['script'] = `Give someone a compliment`
                break;
            case 1:
                let randomNum = Math.round(Math.random() * (rituals['social']['questions'].length - 1))
                let randomQ = rituals['social']['questions'][randomNum]
                
                emailer.emailContent("Ask someone this question", randomQ)

                interactionInfo['title'] = `question: ${randomQ}`
                interactionInfo['script'] = `Ask someone this question: ${randomQ}`
                break;
            case 2:
                let newRiddle = await fetch(riddlesUrl)
                .then(res => res.json())
                .then(json => {
                    let randomIndex = Math.round(Math.random() * json['data']['children'].length)
                    try {
                        let riddleTitle = json['data']['children'][randomIndex]['data']['title']
                        let riddleText = json['data']['children'][randomIndex]['data']['selftext']
                        emailer.emailContent(riddleTitle, riddleText)
                        return riddleTitle + " " + riddleText
                    } catch (error) {
                        emailer.emailContent("Share a random riddle", "https://www.reddit.com/r/riddles/")
                        return "Check your e-mail!"
                    }
                })
                interactionInfo['title'] = `riddle: ${newRiddle}`
                interactionInfo['script'] = newRiddle
                break;
            case 3:
                let newJoke = await fetch(jokesUrl)
                .then(res => res.json())
                .then(json => {
                    let randomIndex = Math.round(Math.random() * json['data']['children'].length)
                    try {
                        let jokeTitle = json['data']['children'][randomIndex]['data']['title']
                        let jokeText = json['data']['children'][randomIndex]['data']['selftext']
                        emailer.emailContent(jokeTitle, jokeText)
                        return riddleTitle + " <break time='5s'/>" + riddleText
                    } catch (error) {
                        emailer.emailContent("Share a random joke", "https://www.reddit.com/r/Jokes/")
                        return "Check your e-mail!"
                    }
                })
                interactionInfo['title'] = `random joke: ${newJoke}`
                interactionInfo['script'] = newJoke
                break;
            case 4:
                interactionInfo['title'] = "gratitude"
                interactionInfo['script'] = `Add to your gratitude log`
            }
        return interactionInfo
    }
}

module.exports = Interactions