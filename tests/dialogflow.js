const dialogflow = require('dialogflow');
const uuid = require('uuid');
const textToSpeech = require('../modules/textToSpeech');

var thingsToSay = {
	'breathing-exercise': 'Fine!'
}

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(projectId = 'fitter-happier-233800') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();


  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: 'help me do a breathing exercise',
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  console.log(responses[0].queryResult.outputContexts)
  const result = responses[0].queryResult;
  textToSpeech.say(thingsToSay[result.intent.displayName])
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}


runSample(projectId = 'fitter-happier-233800')