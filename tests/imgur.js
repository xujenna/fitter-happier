const fetch = require("node-fetch")
const emailer = require('emailer');

const term = "aww"
const url = `https://api.imgur.com/3/gallery/search/top/1/?q=${term}`
const IMGUR_API_CLIENT = "69f36c02b54a476" // your client api

fetch(url, {headers: {Authorization: `Client-ID ${IMGUR_API_CLIENT}`}})
    .then(res => res.json())
    .then(json => {
        let randomIndex = Math.round(Math.random() * json.data.length)
        //   let imgsLength = (json['data'][randomIndex]['images']).length
        //   let randomImgIndex = Math.round(Math.random() * imgsLength)
        try {
            console.log(json['data'][randomIndex]['link'])
        } catch (error) {
            console.log(json['data'][randomIndex]['images'][0]['link'])
        }
    })



const Intervention = require('./base')
const fetch = require("node-fetch")

class Seal extends Intervention {
    async trigger() {
        fetch(url, {headers: {Authorization: `Client-ID ${IMGUR_API_CLIENT}`}})
        .then(res => res.json())
        .then(json => {
            let randomIndex = Math.round(Math.random() * json.data.length)
            //   let imgsLength = (json['data'][randomIndex]['images']).length
            //   let randomImgIndex = Math.round(Math.random() * imgsLength)
            try {
                let link = json['data'][randomIndex]['link']
                emailer.emailContent("Something to cheer you up :)", link)
                return true
            } catch (error) {
                let link = json['data'][randomIndex]['images'][0]['link']
                emailer.emailContent("Something to cheer you up :)", link)
                return true
            }
        })
    }

    getScript() {
        return `I sent you something cute!`
    }
}

module.exports = Seal