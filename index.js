var Imap = require("imap");
var MailParser = require('mailparser').MailParser;
var Promise = require("bluebird");
var inspect = require('util').inspect;
var fs = require ('fs');
var base64 = require('base64-stream');
Promise.longStackTraces();
require('dotenv').config()

const myPwd = process.env.PWD;
const myMail = 'erisoyemi@gmail.com';

var imapConfig = {
    user: myMail,
    password: myPwd,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
      },
}

function toUpper(thing) {return thing && thing.toUpperCase ? thing.toUpperCase() : thing;
}

function findAttachmentParts(struct, attachments){
    attachments = attachments || [];
    for (var i = 0, len = struct.length, r; i <len; ++i) {
        if(Array.isArray(struct[i])) {
            findAttachmentParts(struct[i], attachments);
        } else{
            if (struct[i].disposition && ['INLINE', 'ATTACHMENT'].indexOf(toUpper(struct[i].disposition.type))>-1) {
                attachments.push(struct[i]);
            }
        }
    }
    return attachments;
}

function buildAttMessageFunction(attachment) {
    var filename = attachment.params.name;
    var encoding = attachment.encoding;

    return function (msg, seqno) {
        var prefix = '(#' + seqno +') ';
        msg.on('body', function(stream, info) {
            console.log(prefix + 'Streaming this attachment to file, filename, info');
            var writeStream = fs.createWriteStream(filename);
            writeStream.on('finish', function(){
                console.log(prefix + 'Done writing to file %s', filename);
            });

            if (toUpper(encoding) === 'BASE64'){
                stream.pipe(base64.decode()).pipe(writeStream);
            } else{
                stream.pipe(writeStream);
            }
        });
        msg.once('end', function() {
            console.log(prefix + 'Finished attachment %s', filename);
        });
    };
}

var imap = new Imap(imapConfig);
Promise.promisifyAll(imap);

imap.once("ready", execute);
imap.once("error", function(err) {
    console.log("Connection error: " + err.stack);
});

imap.connect();

function execute() {
    imap.openBox("INBOX", false, function(err, mailBox) {
        if (err) {
            console.error(err);
            return;
        }
        imap.search([ 'UNSEEN', ['SINCE', 'August 29, 2022'] ], function(err, results) {
            if(!results || !results.length) {console.log("No unread mails"); imap.end(); return;}

            var f = imap.fetch(results, {bodies: ""});
            f.on("message", processMessage);
            f.once("error", function(err){
                return Promise.reject(err);
            });
            f.once("end", function(){
                console.log("Done fetching seen messages.");
                imap.end();
            });
        });
    });
}

function processMessage(msg, seqno) {
    console.log("Processing msg #" + seqno);
    // console.log(msg);

    var parser = new MailParser();
    parser.on ("headers", function(headers){
        console.log("Header: " + JSON.stringify(headers));
    });

    parser.on('data', data => {
        if (data.type === 'text') {
            console.log(seqno);
            console.log(data.text); 
        }
    });

    msg.on("body", function(stream) {
        stream.on("data", function(chunk){
            parser.write(chunk.toString("utf8"));
        });
    });
    msg.once("end", function(){
        parser.end();
    });
}