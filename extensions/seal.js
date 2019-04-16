const Intervention = require('./base')
const fetch = require("node-fetch")
const emailer = require('../modules/emailer');

const term = "aww"
const url = `https://api.imgur.com/3/gallery/search/top/1/?q=${term}`
const IMGUR_API_CLIENT = "69f36c02b54a476" // your client api

class Seal extends Intervention {
    async trigger() {
        let gifInfo = {
            script: "Check your e-mail!",
            title: ""
        }
        let gifLink = await fetch(url, {headers: {Authorization: `Client-ID ${IMGUR_API_CLIENT}`}})
        .then(res => res.json())
        .then(json => {
            let randomIndex = Math.round(Math.random() * json.data.length)
            try {
                let link = json['data'][randomIndex]['link']
                return link
            } catch (error) {
                let link = json['data'][randomIndex]['images'][0]['link']
                return link
            }
        })
    await emailer.emailContent("Something to cheer you up :)", gifLink)
    gifInfo['title'] = gifLink;
    return gifInfo
    }
}

module.exports = Seal