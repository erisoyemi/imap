var Imap = require('imap');

var imap = new Imap({
    user: 'erisoyemi@gmail.com',
    password : 'Olaoluwa1',
    host: 'imap.gmail.com',
    port: 993,
    tls: true
})

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
    // event will call when imap is successfully connected wih imap host
    
    openInbox(function(err, box) {
        if (err) throw err;
        // Change the date with the one from which you want receive emails
        //Unseen means you'll only get mails that are unseen
        imap.search([ 'UNSEEN', ['SINCE', 'June 15, 2018']], function(err, results){
            if (err) throw err;
            var f = imap.fetch(results, { bodies: '' });
        }) 
    
    })
})

imap.once('error', function(err) {
    // this event will call if there is an error during connection
    console.log(err);
})

imap.once('end', function() {
    //event will call when imap connection is closed
    console.log('connection ended');
})

imap.connect() // attempts to connect imap to mail host

