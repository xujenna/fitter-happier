const Intervention = require('./base')
const rituals = require('../selfcare-scripts/rituals.json')
const emailer = require('../modules/emailer');

class Interactions extends Intervention {

    async trigger() {
        let interactionInfo = {}

        switch(Math.round(Math.random() * 3)){
            case 0:
                interactionInfo['title'] = "compliment"
                interactionInfo['script'] = `Give someone a compliment`
                break;
            case 1:
                let randomNum = Math.round(Math.random() * (rituals['social']['questions'].length - 1))
                let randomQ = rituals['social']['questions'][randomNum]
                
                emailer.emailContent("Ask someone this question", randomQ)

                interactionInfo['title'] = "question"
                interactionInfo['script'] = `Ask someone this question: ${randomQ}`
                break;
            case 2:
                const url = "https://www.reddit.com/r/riddles/new.json?sort=new&limit=100"

                let newRiddle = await fetch(url)
                .then(res => res.json())
                .then(json => {
                    let randomIndex = Math.round(Math.random() * json['data']['children'].length)
                    try {
                        let riddleTitle = json['data']['children'][randomIndex]['data']['title']
                        let riddleText = json['data']['children'][randomIndex]['data']['selftext']
                        emailer.emailContent(riddleTitle, riddleText)
                        return riddleTitle + " " + riddleText
                    } catch (error) {
                        let link = json['data'][randomIndex]['images'][0]['link']
                        emailer.emailContent("Share a random riddle", "https://www.reddit.com/r/riddles/")
                        return "Check your e-mail!"
                    }
                })
                interactionInfo['title'] = "riddle"
                interactionInfo['script'] = newRiddle
            case 3:
                interactionInfo['title'] = "gratitude"
                interactionInfo['script'] = `Add to your gratitude log`
                break;
            }
        return interactionInfo
    }
}

module.exports = Interactions