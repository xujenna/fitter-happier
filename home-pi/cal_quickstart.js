const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const fetch = require('node-fetch')
const database = require('../modules/datastore');

const landmarkList = require('../selfcare-scripts/NYC_landmarks_wiki.json')
let keys = Object.keys(landmarkList['query']['pages'])

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('../home-pi/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), start);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
// function listEvents(auth) {
//   const calendar = google.calendar({version: 'v3', auth});
//   calendar.events.list({
//     calendarId: 'primary',
//     timeMin: (new Date()).toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const events = res.data.items;
//     if (events.length) {
//       console.log('Upcoming 10 events:');
//       events.map((event, i) => {
//         const start = event.start.dateTime || event.start.date;
//         console.log(`${start} - ${event.summary}`);
//       });
//     } else {
//       console.log('No upcoming events found.');
//     }
//   });
// }

function fail(auth){
    let keys = Object.keys(landmarkList['query']['pages'])

    keys.forEach((key, index) => {
        setTimeout(function() {
            getLandmarks(key).then(result=> {
                // setTimeout(function(){
                    if(result !== null && result !== undefined){
                        addEvent(result,auth)
                    }
                // }, 10000)
            })
        }, 10000)
    })
}


function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


const wowTimeout = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout))
}

const timeout = 1000
const multiplier = 50

async function start(auth) {
    let keys = Object.keys(landmarkList['query']['pages']);
    shuffle(keys);

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index]

        try {
            const landmark = await getLandmarks(key)
            console.log("Landmark:", landmark)
            
            if(landmark) {
                await addEvent(landmark,auth)
            }
        } catch (error) {
            console.log('Failed to get landmark', error)
        }

        await wowTimeout(timeout + index * multiplier)
    }
}

function getLandmarks(key){
    let landmarkName = landmarkList['query']['pages'][key]['title']
    let formattedLandmark = encodeURI(landmarkName.replace(" ", "_"));
    const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + formattedLandmark
    
    let landmarkInfo = fetch(url)
    .then(res => res.json())
    .then(json => {
        try{
            let lat = json['coordinates']['lat']
            let long = json['coordinates']['lon']
            let latLong = lat + "," + long
            let description = json['extract']
            let landmarkInfo = {
                name: landmarkName,
                latLong: latLong,
                description: description
            }
            return landmarkInfo
        }
        catch{
            return null;
        }
    })

    if(landmarkInfo !== null){
        return landmarkInfo
        // addEvent(landmarkInfo,i, auth)
    }

}

function add_weeks(dt, n) {
    return new Date(dt.setDate(dt.getDate() + (n * 7)));      
 }

// let dt = new Date();
index = 1;

function addEvent(landmarkInfo, auth) {
    let newDate = add_weeks(new Date(), index).toISOString();
    console.log(newDate.substring(0,10))
    console.log(index)
    var event = {
        'summary': landmarkInfo.name,
        'location': landmarkInfo.latLong,
        'description': landmarkInfo.description,
        'start': {
            'date': newDate.substring(0,10),
            'timeZone': 'America/New_York'
        },
        'end': {
            'date': newDate.substring(0,10),
            'timeZone': 'America/New_York'
        }
    }

    const calendar = google.calendar({version: 'v3', auth});  
    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created: %s', event.data.htmlLink);
        index += 1;

        if(new Date(newDate).getFullYear() == 2019 && new Date(newDate).getMonth() < 6){
            let timestamp = + new Date(newDate.substring(0,10) + "T17:30:00.000Z")
            console.log(timestamp)
            database.ritualsRef.push().set({
                timestamp: timestamp,
                ritual: "field trip to " + landmarkInfo.name,
                content: landmarkInfo.description
            })
        }
    });
}
