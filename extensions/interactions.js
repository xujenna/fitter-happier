const Intervention = require('./base')
const rituals = require('../selfcare-scripts/rituals.json')
const emailer = require('../modules/emailer');
const fetch = require("node-fetch");

class Interactions extends Intervention {

    async trigger() {
        let interactionInfo = {}
        const riddlesUrl = "https://www.reddit.com/r/riddles/top.json?sort=top&limit=100"
        const jokesUrl = "https://www.reddit.com/r/dadjokes/top.json?sort=top&limit=100"
        const cuteFactUrl = "https://www.reddit.com/r/Awwducational/top.json?sort=top&limit=100"

        const directions = ["forward", "backward", "left", "right"];
        const instructions = "Take " + Math.round(Math.random() * 10) + " steps " + directions[(Math.round(Math.random() * (directions.length-1)))] + ", " + Math.round(Math.random() * 10) + " steps " + directions[Math.round(Math.random() * (directions.length-1))] + ", and "

        switch(Math.round(Math.random() * 3)){
            case 0:
                interactionInfo['title'] = "compliment"
                interactionInfo['script'] = instructions + "compliment the first person in front of you."
                break;
            case 1:
                let randomNum = Math.round(Math.random() * (rituals['social']['questions'].length - 1))
                let randomQ = rituals['social']['questions'][randomNum]
                
                await emailer.emailContent("Ask someone this question", randomQ)

                interactionInfo['title'] = `question: ${randomQ}`
                interactionInfo['script'] = instructions + `ask this question: ${randomQ}`
                break;
            case 2:
                let newRiddle = await fetch(riddlesUrl)
                .then(res => res.json())
                .then(json => {
                    let shortRiddleIndices = []
                    for(var i = 0; i < 8; i++){
                        let randomIndex = Math.round(Math.random() * json['data']['children'].length)
                        if(json['data']['children'][randomIndex]['data']['selftext'].length < 350){
                            shortRiddleIndices.push(randomIndex)
                        }
                    }
                    let randomShortIndex = Math.round(Math.random() * (shortRiddleIndices.length - 1))
                    try {
                        let riddleTitle = json['data']['children'][shortRiddleIndices[randomShortIndex]]['data']['title']
                        let riddleText = json['data']['children'][shortRiddleIndices[randomShortIndex]]['data']['selftext']
                        mailer.emailContent(riddleTitle, riddleText)
                        return riddleTitle + " " + riddleText
                    } catch (error) {
                        emailer.emailContent("Share a random riddle", "https://www.reddit.com/r/riddles/")
                        return "Check your e-mail!"
                    }
                })
                interactionInfo['title'] = `riddle: ${newRiddle}`
                interactionInfo['script'] = instructions + `ask this riddle: ${newRiddle}`
                break;
            // case 3:
            //     let newJoke = await fetch(jokesUrl)
            //     .then(res => res.json())
            //     .then(json => {
            //         let shortJokeIndices = []
            //         for(var i = 0; i < 5; i++){
            //             let randomIndex = Math.round(Math.random() * json['data']['children'].length)
            //             if(json['data']['children'][randomIndex]['data']['selftext'].length < 350){
            //                 shortJokeIndices.push(randomIndex)
            //             }
            //         }
            //         let randomShortIndex = Math.round(Math.random() * (shortJokeIndices.length - 1))
            //         try {
            //             let jokeTitle = json['data']['children'][shortJokeIndices[randomShortIndex]]['data']['title']
            //             let jokeText = json['data']['children'][shortJokeIndices[randomShortIndex]]['data']['selftext']
            //             emailer.emailContent(jokeTitle, jokeText)
            //             return jokeTitle + "... " + jokeText
            //         } catch (error) {
            //             emailer.emailContent("Share a random joke", "https://www.reddit.com/r/Jokes/")
            //             return "Check your e-mail!"
            //         }
            //     })
            //     interactionInfo['title'] = `random joke: ${newJoke}`
            //     interactionInfo['script'] = instructions + `tell them this joke: ${newJoke}`
            //     break;
            case 3:
                let factInfo = await fetch(cuteFactUrl)
                .then(res => res.json())
                .then(json => {
                    try {
                        let randomIndex = Math.round(Math.random() * 4)
                        let fact = json['data']['children'][randomIndex]['data']['title']
                        let subject;
                        if(fact.length > 75){
                            subject = fact.slice(0,50) + "..."
                        }
                        else{
                            subject = fact
                        }
                        let imgLink = json['data']['children'][randomIndex]['data']['preview']['images'][0]['source']['url']
                        let body = "<p>" + fact + "</p>" + "<p><img src='" + imgLink + "'></p>"
                
                        emailer.emailContent(subject, body)
                
                        interactionInfo['title'] = imgLink
                        interactionInfo['script'] = fact + " Check your e-mail for pix!"
                        return interactionInfo
                        
                    } catch (error) {
                        console.log(error)
                        emailer.emailContent("Share a random animal fact", "https://www.reddit.com/r/Awwducational")
                        return "Check your e-mail!"
                    }
                })
                interactionInfo['title'] = factInfo.title
                interactionInfo['script'] = factInfo.script
            }
        return interactionInfo
    }
}

module.exports = Interactions