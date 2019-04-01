const Intervention = require('./base')
var videos = require('../selfcare-scripts/videos.json');
const emailer = require('../modules/emailer');

class Videos extends Intervention {
    async trigger(){
        let vidInfo = {
            script: "Check your e-mail!",
            title: ""
        }

        if(this.marker == "stress"){ 
            let randomIndex = Math.round(Math.random() * (videos['stress']['script'].length- 1))
            let randomVideo = videos['stress']['script'][randomIndex]
            vidInfo['title'] = randomVideo
            emailer.emailContent("Something to calm you down :)", randomVideo)
            return vidInfo
        }
        else if(this.marker =="morale"){
            let randomIndex = Math.round(Math.random() * (videos['morale']['script'].length- 1))
            let randomVideo = videos['morale']['script'][randomIndex]
            vidInfo['title'] = randomVideo
            emailer.emailContent("Something to hype you up :)", randomVideo)
            return vidInfo
        }
    }

}

module.exports = Videos