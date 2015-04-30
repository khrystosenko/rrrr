var express = require('express');
var bodyParser = require('body-parser');

var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var app = express();

app.use(express.static('./../web-client'));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "wakeupkirill@gmail.com",
        pass: "password"
    },
    ignoreTLS: true
});

app.post('/sendMail', function (req, res) {
 
 var receiver = req.param('email');
 console.log(req.params);
 console.log(req.body);
 // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "Fred Foo <wakeupkirill@gmail.com>", // sender address
        to: 'kkhrystosenko@gmail.com,'+receiver, // list of receivers
        subject: "Hello ", // Subject line
        text: "Hello world ", // plaintext body
        html: "<b>Hello world</b>" // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
        res.send();
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
});

app.listen(9000, function() {
    console.log('started')
});