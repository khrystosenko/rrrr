var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

var app = express(),
    server = require('http').createServer(app);

app.use(express.static('./roomit/web-client'));
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
        user: "email",
        pass: "parol"
    },
    ignoreTLS: true
});

app.post('/sendMail', function (req, res) {
 
 var MongoClient = require('mongodb').MongoClient,
     mongo_url = 'mongodb://user:pass' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/roomittv';
 MongoClient.connect(mongo_url, function(err, db) {
    var collection = db.collection('users');
    collection.insert({
       name: req.param('name'),
       email: req.param('email')
    }, function() {console.log('New entry added.')});
 });
 var receiver = req.param('email');
 console.log(req.params);
 console.log(req.body);
 fs.readFile('./roomit/web-client/html/email-layout.html', function (err, html) {
    // setup e-mail data with unicode symbols
    html = html.toString().replace('{%USER%}', req.param('name'));
    var mailOptions = {
        from: "roomit.tv team <noreply@roomittv.info>", // sender address
        to: receiver, // list of receivers
        subject: "Premium account", // Subject line
        text: "", // plaintext body
        html: html // html body
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
});

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080,  
    ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

server.listen(port, ip, function() {console.log('Server is running.')});
