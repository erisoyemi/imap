//const { parseBODYSTRUCTURE } = require('emailjs-imap-client/dist/command-parser');

require('dotenv').config()

const Imap = require('imap'), inspect = require('util').inspect; 
const fs = require('fs'), fileStream = require('util').inspect;

const myMail = 'erisoyemi@gmail.com';
const myPwd = process.env.PWD;
const inbox = [];
const components =[];
let count = 0;

let mailServer = new Imap({
  user: myMail,
  password: myPwd,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false
  },
  authTimeout: 3000
}).once('error', function (err) {
  console.log('Source Server Error:- ', err);
});

function getinbox() {
  
}

function openInbox(cb) {
  mailServer.openBox('INBOX', true, cb);
}

mailServer.once('ready', function() {

  mailServer.openBox('INBOX', true, function(err, box){
    if (err) throw err;
    mailServer.search([ 'SEEN', ['SINCE', 'September 03, 2022'] ], function(err, results) { 
      if (err) throw err;
      var f = mailServer.fetch(results, { bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE BODY)' });
      f.on('message', function (msg, seqno) {
        let prefix = '(#' + seqno + ') ';
        
        msg.on('body', function (stream, info) {
            let buffer = '';

            stream.on('data', function (chunk) {
                buffer += chunk.toString('utf8');
            });

            stream.once('end', function(){
                inbox.push(prefix +  inspect(Imap.parseHeader(buffer)));
            });
        });
        count = count + 1;
        //inbox.push(count)
        
    });
    f.once('error', function (err){
        console.log('Fetch error: ' + err);
    });

    f.once('end', function(){
        console.log('Done fetching all messages!');
        console.log(inbox)
        mailServer.end();
    });
    });
  });
  });
  
  mailServer.once('error', function(err) {
    console.log(err);
  });
  
  mailServer.once('end', function() {
    console.log('Connection ended');
  });

  mailServer.connect();

module.export = {inbox};