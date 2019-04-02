const fs = require('fs');
const playlist = require('../modules/playlist');
var exec = require('child_process').execSync;

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

async function say(something){
    if(!something.includes(".wav") && !something.includes(".mp3")){
        var sayThis = something.replace(/["]+/g, '\"');
        exec("espeak \" Hey Jenna, " + sayThis + "\" -v en-gb --stdout | aplay -D bluealsa:HCI=hci0,DEV=00:00:00:00:88:C8,PROFILE=a2dp")
    }
    else{
        exec("espeak \" Hey Jenna, listen to this.\" -v en-gb --stdout | aplay -D bluealsa:HCI=hci0,DEV=00:00:00:00:88:C8,PROFILE=a2dp")
        exec("aplay -D bluealsa:HCI=hci0,DEV=00:00:00:00:88:C8,PROFILE=a2dp " + something)
    }
}

function playAudio(file) {
    playlist.addToPlayQueue(file);
}

// Export say function
module.exports = {
    say: say
}


// old google cloud TTS 

// let arrayTranscript = [];
// let playlist = [];
// if(typeof something == "string"){
//     arrayTranscript.push(something)
// }
// else{
//     arrayTranscript = something
// }

// arrayTranscript.forEach((d,i) =>{
//     var sayThis = d.replace(/["]+/g, '\"');
//     playlist.push('output'+i+'.wav');

//     const request = {
//         input: {ssml: "Hey Jenna, <break time='1s'/>" + sayThis},
//         voice: {languageCode: 'en-US', name: 'en-GB-Standard-D', ssmlGender: 'NEUTRAL'},
//         audioConfig: {audioEncoding: 'LINEAR16'},
//     };
//     // console.log(d);

//     // Performs the Text-to-Speech request
//     client.synthesizeSpeech(request, (err, response) => {
//         if (err) {
//             console.error('ERROR:', err);
//             return;
//         }
    
//         // Write the binary audio content to a local file
//         fs.writeFile('output'+i+'.wav', response.audioContent, 'binary', err => {
//         if (err) {
//             console.error('ERROR:', err);
//             return;
//         }
//         if(i == arrayTranscript.length-1){
//             console.log(playlist)
//             playlist.forEach(d=>{
//                 playAudio(d)
//             })
//         }
//         });
//     });

// })