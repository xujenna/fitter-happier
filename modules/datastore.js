// initialize firebase
var admin = require("firebase-admin");
var serviceAccount = require('../credentials/mood-predictions-firebase-adminsdk-0ns22-7a7b9f250c.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://mood-predictions.firebaseio.com/'
});

var db = admin.database();
var predictionsRef = db.ref("predictions");
var interventionsRef = db.ref("interventions");
var ritualsRef = db.ref("rituals");
var runningMeanRef = db.ref("runningMean");


// https://firebase.google.com/docs/database/admin/save-data


// Export db references
module.exports = {
    predictionsRef: predictionsRef,
    interventionsRef: interventionsRef,
    ritualsRef: ritualsRef,
    runningMeanRef: runningMeanRef
}