var nodemailer = require('nodemailer');
var cred = require('../credentials/email.json');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: cred.user,
    pass: cred.pass
  }
});


function emailContent(subject, text){
    let body = ""
    if(typeof text == "object"){
        text.forEach(d=>{
            body += (d + "<br>")
        })
    }
    else{
        body = text
    }

    var mailOptions = {
        from: 'Fitter Happier <fitterhappierbot@gmail.com>',
        to: 'xujenna@gmail.com',
        subject: subject,
        html: body
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                reject(error)
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info)
            }
        });
    })
}


module.exports = {
    emailContent: emailContent
}