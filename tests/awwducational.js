const fetch = require("node-fetch");
const cuteFactUrl = "https://www.reddit.com/r/Awwducational/top.json?sort=top&limit=100"
let interactionInfo = {}
const emailer = require('../modules/emailer');

async function test() {
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
            emailer.emailContent("Share a random joke", "https://www.reddit.com/r/Awwducational")
            return "Check your e-mail!"
        }
    })
    interactionInfo['title'] = factInfo.title
    interactionInfo['script'] = factInfo.script
    console.log(interactionInfo)
}

test()