var nodemailer = require('nodemailer');
var cred = require('../credentials/email.json');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: cred.user,
    pass: cred.pass
  }
});


async function emailContent(subject, text){
    let body = ""
    if(typeof text == "object"){
        text.forEach(d=>{
            body += (d + "\n")
        })
    }
    else{
        body = text
    }
    var mailOptions = {
        from: 'Fitter Happier <fitterhappierbot@gmail.com>',
        to: 'xujenna@gmail.com',
        subject: subject,
        text: body
      };
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


module.exports = {
    emailContent: emailContent
}