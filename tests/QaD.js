const emailer = require('../modules/emailer');
const fetch = require("node-fetch");
const readline = require('readline');
var exec = require('child_process').execSync;
const rituals = require('../selfcare-scripts/rituals.json')

async function say(something){
    var sayThis = something.replace(/["]+/g, '\"');
    exec("say " + sayThis)
}

function start() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question("\n\nHello, my name is Fitter Happier; I'm Jenna's sanity maintenance system. \n Let me take care of you tonight! Press 'y' when you're ready: ", (answer) => {
          // TODO: Log the answer in a database
          if(answer.includes("y") || answer.includes("yes")){
              getCommand();
          }
          else{
              return;
          }
        });
}

async function getCommand() {
    let interactionInfo = {}
    const riddlesUrl = "https://www.reddit.com/r/riddles/top.json?sort=top&limit=100"
    const jokesUrl = "https://www.reddit.com/r/Jokes/top.json?sort=top&limit=100"

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
            console.log(instructions + `ask this question: \n\n ${randomQ}`)
            say(instructions + `ask the first person you see this question: ${randomQ}`)
            break;
        case 2:
            let newRiddle = await fetch(riddlesUrl)
            .then(res => res.json())
            .then(json => {
                let randomIndex = Math.round(Math.random() * json['data']['children'].length)
                let riddleTitle = json['data']['children'][randomIndex]['data']['title']
                let riddleText = json['data']['children'][randomIndex]['data']['selftext']
                let riddle = {
                    riddleTitle: riddleTitle,
                    riddleText: riddleText
                }
                return riddle
            })
            console.log(instructions + `ask this riddle: \n\n ${newRiddle.riddleTitle} \n\n ${newRiddle.riddleText}`)
            say(instructions + `ask the first person you see this riddle.`)
            break;
        case 3:
            let newJoke = await fetch(jokesUrl)
            .then(res => res.json())
            .then(json => {
                let randomIndex = Math.round(Math.random() * json['data']['children'].length)
                    let jokeTitle = json['data']['children'][randomIndex]['data']['title']
                    let jokeText = json['data']['children'][randomIndex]['data']['selftext']
                    let joke = {
                        jokeTitle: jokeTitle,
                        jokeText: jokeText
                    }
                    return joke
            })
            console.log(instructions + `tell the first person you see this joke: \n\n ${newJoke.jokeTitle} \n\n ${newJoke.jokeText}`)
            say(instructions + `tell the first person you see this joke.`)
        }
        start()
}

start()