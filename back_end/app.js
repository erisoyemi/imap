const { parseBODYSTRUCTURE } = require('emailjs-imap-client/dist/command-parser');

require('dotenv').config()

const Imap = require('imap'), inspect = require('util').inspect; 
const fs = require('fs'), fileStream = require('util').inspect;

const myMail = 'erisoyemi@gmail.com';
const myPwd = process.env.PWD;

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

function openInbox(cb) {
  mailServer.openBox('INBOX', true, cb);
}

mailServer.once('ready', function() {

  mailServer.openBox('INBOX', true, function(err, box){
    if (err) throw err;
    mailServer.search([ 'SEEN', ['SINCE', 'August 29, 2022'] ], function(err, results) { 
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
                console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
            });
        });
    });
    f.once('error', function (err){
        console.log('Fetch error: ' + err);
    });

    f.once('end', function(){
        console.log('Done fetching all messages!');
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