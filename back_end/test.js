var Imap = require(imap);
var MailParser = require('mailparser').MailParser;
var Promise = require(bluebird);
Promise.longStackTraces();

var imapConfig = {
    user 'erisoyemi@gmail.com',
    password oqufwcbqkgmajzvr,
    host 'imap.gmail.com',
    port 993,
    tls true,
    tlsOptions {
        rejectUnauthorized false
      },
}

var imap = new Imap(imapConfig);
Promise.promisifyAll(imap);

imap.once(ready, execute);
imap.once(error, function(err) {
    console.log(Connection error  + err.stack);
});

imap.connect();

function execute() {
    imap.openBox(INBOX, false, function(err, mailBox) {
        if (err) {
            console.error(err);
            return;
        }
        imap.search([ 'SEEN', ['SINCE', 'August 23, 2022'] ], function(err, results) {
            if(!results  !results.length) {console.log(No unread mails); imap.end(); return;}

            var f = imap.fetch(results, {bodies });
            f.on(message, processMessage);
            f.once(error, function(err){
                return Promise.reject(err);
            });
            f.once(end, function(){
                console.log(DOne fetching seen messages.);
                imap.end();
            });
        });
    });
}

function processMessage(msg, seqno) {
    console.log(Processing msg # + seqno);
     console.log(msg);

    var parser = new MailParser();
    parser.on (headers, function(headers){
        console.log(Header  + JSON.stringify(headers));
    });

    parser.on('data', data = {
        if (data.type === 'text') {
            console.log(seqno);
            console.log(data.text); 
        }
    });

    msg.on(body, function(stream) {
        stream.on(data, function(chunk){
            parser.write(chunk.toString(utf8));
        });
    });
    msg.once(end, function(){
        parser.end();
    });
}