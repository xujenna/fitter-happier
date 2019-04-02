const fs = require('fs');
const playlist = require('../modules/playlist');


async function say(something){
    let arrayTranscript = [];
    let playlist = [];
    if(typeof something == "string"){
        arrayTranscript.push(something)
    }
    else{
        arrayTranscript = something
    }

    arrayTranscript.forEach((d,i) =>{

        playlist.forEach(d=>{
            playAudio(d)
        })

    })
}


function playAudio(file) {
    playlist.addToPlayQueue(file);
}

// Export say function
module.exports = {
    say: say
}