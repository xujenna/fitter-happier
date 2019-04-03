const emailer = require('../modules/emailer');
const fetch = require("node-fetch");
const readline = require('readline');
var exec = require('child_process').execSync;
const rituals = require('../selfcare-scripts/rituals.json')
const fs = require('fs');


async function say(something){
    var sayThis = something.replace(/["]+/g, '\"');
    exec(`say \"${sayThis}\" -r 210`)
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

function start() {
    process.stdout.write('\033c')
    rl.question("\n\nHello, my name is Fitter Happier. \nI'm Jenna's sanity maintenance system. \nWhat would you like to do? \n\n> 1. Do something fun \n> 2. Get more info about this \n> 3. Give feedback \n\n>>>> ", (answer) => {
        if(answer.includes("1")){
            console.log("\n\n")
            getCommand();
        }
        else if (answer.includes("2")){
            getInfo();
        }
        else if (answer.includes("3")){
            getFeedback();
        }
        else{
            console.log("\n\n")
            getCommand();
        }

    });
}

async function getCommand() {
    const dadJokeURL = "https://www.reddit.com/r/dadjokes/top.json?sort=top&limit=100"
    const jokesUrl = "https://www.reddit.com/r/Jokes/top.json?sort=top&limit=100"

    const directions = ["forward", "backward", "left", "right"];
    let directionIndex = (Math.round(Math.random() * (directions.length-2)))
    let directionIndex2 = directionIndex + 1
    const instructions = "Take " + (Math.round(Math.random() * 9) + 1) + " steps " + directions[directionIndex] + ", " + (Math.round(Math.random() * 9) + 1) + " steps " + directions[directionIndex2] + ", and "

    switch(Math.round(Math.random() * 4)){
        case 0:
            console.log(instructions + "give the first person you see a compliment.")
            say(instructions + "give the first person you see a compliment.")
            break;
        case 1:
            let randomNum = Math.round(Math.random() * (rituals['social']['questions'].length - 1))
            let randomQ = rituals['social']['questions'][randomNum]
            console.log(instructions + `ask this question: \n\n ${randomQ}`)
            say(instructions + `ask the first person you see this question: \n\n ${randomQ}`)
            break;
        case 2:
            let newDadJoke = await fetch(dadJokeURL)
            .then(res => res.json())
            .then(json => {
                let shortJokeIndices = []
                for(var i = 0; i < 5; i++){
                    let randomIndex = Math.round(Math.random() * json['data']['children'].length)
                    if(json['data']['children'][randomIndex]['data']['selftext'].length < 350){
                        shortJokeIndices.push(randomIndex)
                    }
                }
                let dadJokeTitle = json['data']['children'][shortJokeIndices[1]]['data']['title']
                let dadJokeText = json['data']['children'][shortJokeIndices[1]]['data']['selftext']

                let dadJoke = {
                    dadJokeTitle: dadJokeTitle,
                    dadJokeText: dadJokeText
                }
                return dadJoke
            })
            console.log(instructions + `tell the first person you see this joke: \n\n ${newDadJoke.dadJokeTitle} \n\n ${newDadJoke.dadJokeText}`)
            say(instructions + `tell the first person you see this joke. \n\n ${newDadJoke.dadJokeTitle} .... ${newDadJoke.dadJokeText}`)
            break;
        case 3:
            console.log(instructions + "ask the first person you see for three good things that happened in their day.")
            say(instructions + "ask the first person you see for three good things that happened in their day.")
            break;
        case 4:
            let newDadJoke2 = await fetch(dadJokeURL)
            .then(res => res.json())
            .then(json => {
                let shortJokeIndices = []
                for(var i = 0; i < 5; i++){
                    let randomIndex = Math.round(Math.random() * json['data']['children'].length)
                    if(json['data']['children'][randomIndex]['data']['selftext'].length < 350){
                        shortJokeIndices.push(randomIndex)
                    }
                }

                let dadJokeTitle = json['data']['children'][shortJokeIndices[1]]['data']['title']
                let dadJokeText = json['data']['children'][shortJokeIndices[1]]['data']['selftext']

                let dadJoke = {
                    dadJokeTitle: dadJokeTitle,
                    dadJokeText: dadJokeText
                }
                return dadJoke
            })
            console.log(instructions + `tell the first person you see this joke: \n\n ${newDadJoke2.dadJokeTitle} \n\n ${newDadJoke2.dadJokeText}`)
            say(instructions + `tell the first person you see this joke. \n\n ${newDadJoke2.dadJokeTitle} .... ${newDadJoke2.dadJokeText}`)
        }

    rl.question("\n\n\n\nType any key to start over: ", (answer) => {
        if(answer){
            process.stdout.write('\033c')
            start()
        }
    });
}


function getFeedback(){
    process.stdout.write('\033c')
    say("What is your feedback?")
    rl.question("\n\nWhat is your feedback?' \n ", (answer) => {
        fs.readFile('feedback.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); //now it an object
            let newKey = parseInt(Object.keys(obj)[-1]) + 1
            let newEntry = {
                newKey: answer
            }
            obj.push(newEntry); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('feedback.json', json, 'utf8', start); // write it back 
        }});
    });
}


function getInfo(){
    process.stdout.write('\033c')
    console.log("\n\n\nFitter Happier is a voice assistant that maintains Jenna's mental health. \n\nIt is portable and lives on a raspberry pi connected to bluetooth earbuds. \n\nIt reads predictions on her mood every 20 minutes, and makes decisions on what she should do to improve her mood, morale, stress, or fatigue. \n\nThe predictions are trained on a year's worth of data collected on various metrics, such as blinks (and other facial markers), browser activity, and keystroke dynamics. \n\nIn addition to these interventions, there are also rituals that aim to strengthen relationships and expose her to new experiences and situations. \n\nThis extension of Fitter Happier demonstrates the social subset of these interventions. \n\nThe overall project explores these two questions: \n\n1. Can technology improve long-term mental health by monitoring, predicting, and intervening on mood? \n\n2. Can it facilitate a lifestyle shift that optimizes for psychological resilience by strengthening relationships, fostering a growth mindset, and expanding my purview?")
    say("Fitter. Happier. More productive.")

    rl.question("\n\n\n\nType any key to return to menu: ", (answer) => {
        if(answer){
            process.stdout.write('\033c')
            start()
        }
    });
}

start()
