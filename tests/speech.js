const fs = require('fs');
const playlist = require('../modules/playlist');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// The text to synthesize
const text = 'Hello, world!';

// Construct the request
const request = {
  input: {text: text},
  // Select the language and SSML Voice Gender (optional)
  voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
  // Select the type of audio encoding
  audioConfig: {audioEncoding: 'MP3'},
};

// Performs the Text-to-Speech request
client.synthesizeSpeech(request, (err, response) => {
  if (err) {
    console.error('ERROR:', err);
    return;
  }

  // Write the binary audio content to a local file
  fs.writeFile('output.mp3', response.audioContent, 'binary', err => {
    if (err) {
      console.error('ERROR:', err);
      return;
    }
    console.log('Audio content written to file: output.mp3');
    playAudio();
  });
});

function playAudio() {
    playlist.addToPlayQueue('output.mp3');
    playlist.addToPlayQueue('output.mp3', () => console.log('TWO'));
    playlist.addToPlayQueue('output.mp3', () => console.log('THREE'));
}