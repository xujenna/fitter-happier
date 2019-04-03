const accountSid = 'AC15fd0560c88cd5efd461afe511a6b463'; 
const authToken = '69a233a4ed9850ce86bf23819cecef44'; 
const client = require('twilio')(accountSid, authToken); 
 
client.messages 
      .create({ 
         body: 'hello there', 
         from: '+12242304891',       
         to: '+16307308188' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();